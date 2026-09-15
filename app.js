document.getElementById("year").textContent = new Date().getFullYear();

// Vídeos reais de Stories nos painéis de coleção: silenciosos e em loop.
// Em "prefers-reduced-motion", ficam pausados no primeiro quadro (poster).
(function () {
  var videos = document.querySelectorAll(".panel-video video");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  videos.forEach(function (video) {
    if (reduceMotion) {
      video.removeAttribute("autoplay");
      video.pause();
      return;
    }
    // Alguns navegadores exigem a chamada explícita de play(); qualquer bloqueio
    // de autoplay é ignorado silenciosamente e o poster permanece visível.
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {});
    }
  });
})();

// Provador virtual (prévia de UI): a foto escolhida nunca sai do navegador —
// só é usada para gerar uma pré-visualização local com URL.createObjectURL.
// Não há upload, envio a servidor ou simulação por IA ainda; isso é
// propositalmente deixado como "em breve" até a funcionalidade real existir.
(function () {
  var input = document.getElementById("tryonInput");
  var img = document.getElementById("tryonPreviewImg");
  var placeholder = document.getElementById("tryonPlaceholder");
  var btnLabel = document.getElementById("tryonBtnLabel");
  var note = document.getElementById("tryonNote");
  if (!input || !img) return;

  var currentUrl = null;

  input.addEventListener("change", function () {
    var file = input.files && input.files[0];
    if (!file) return;

    if (currentUrl) URL.revokeObjectURL(currentUrl);
    currentUrl = URL.createObjectURL(file);

    img.src = currentUrl;
    img.hidden = false;
    placeholder.hidden = true;
    btnLabel.textContent = "Trocar foto";
    if (note) {
      note.textContent = "Foto carregada só neste navegador — a simulação por IA ainda não está ativa. Em breve você verá a peça em você aqui.";
    }
  });
})();

(function () {
  // O CSS já entrega, por padrão, a coleção como pilha vertical simples
  // (.collections-track sem a classe .gsap-pin-ready) — funciona sem
  // nenhum JavaScript. Se o CDN do GSAP falhar, este "return" antecipado
  // simplesmente deixa esse layout base no lugar, com as 4 categorias
  // continuando acessíveis na rolagem normal da página.
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.warn("GSAP/ScrollTrigger não carregaram — mantendo o layout base (pilha vertical) sem animação.");
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  // Evita recalcular tudo quando a barra de endereço do navegador móvel
  // aparece/some durante a rolagem (mudança de altura do viewport).
  ScrollTrigger.config({ ignoreMobileResize: true });

  // Revelação de texto da seção "Sobre" — leve, sem pin, segura em qualquer tela.
  gsap.utils.toArray(".rev").forEach(function (el) {
    var isFadePart = el.classList.contains("fade");
    gsap.fromTo(
      el,
      { opacity: 0.28 },
      {
        opacity: isFadePart ? 0.28 : 1,
        duration: 0.6,
        scrollTrigger: {
          trigger: ".story",
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  // gsap.matchMedia() escopa as animações por breakpoint e reagrupa tudo
  // automaticamente no resize — é a forma recomendada pelo GSAP de fazer
  // ScrollTrigger responsivo.
  var mm = gsap.matchMedia();

  // Parallax completo + pin em QUALQUER largura de tela (celular incluído) —
  // só desliga com "prefers-reduced-motion", nunca por tamanho de tela.
  mm.add("(prefers-reduced-motion: no-preference)", function () {
    // HERO: a foto de fundo se move mais devagar que o texto da frente —
    // o efeito parallax "clássico" descrito no briefing original.
    gsap.to("#heroPhoto", {
      y: 90,
      scale: 1.08,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });

    gsap.fromTo(
      ".hero-content",
      { y: 0 },
      {
        y: -80,
        opacity: 0.4,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      }
    );

    // COLEÇÕES: só agora — com GSAP/ScrollTrigger já carregados e sem pedido
    // de movimento reduzido — a pilha vertical vira pin + rolagem horizontal.
    // A classe é revertida automaticamente pelo gsap.matchMedia() se a
    // condição deixar de valer (ex.: o sistema muda a preferência de
    // movimento em tempo real).
    var track = document.getElementById("track");
    track.classList.add("gsap-pin-ready");
    var panels = gsap.utils.toArray(".panel");
    var getScrollAmount = function () {
      return -(track.scrollWidth - window.innerWidth);
    };

    var horizontalTween = gsap.to(track, {
      x: getScrollAmount,
      ease: "none",
      scrollTrigger: {
        trigger: ".collections-pin",
        start: "top top",
        end: function () {
          return "+=" + (track.scrollWidth - window.innerWidth);
        },
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
      },
    });

    panels.forEach(function (panel) {
      gsap.fromTo(
        panel.querySelectorAll("h3, p"),
        { opacity: 0.3, y: 24 },
        {
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: panel,
            containerAnimation: horizontalTween,
            start: "left 70%",
            end: "left 20%",
            scrub: true,
          },
        }
      );
    });

    // Limpeza automática do gsap.matchMedia(): se a condição acima deixar
    // de valer (ex.: preferência de movimento muda em tempo real), tira a
    // classe para o CSS voltar sozinho à pilha vertical acessível.
    return function () {
      track.classList.remove("gsap-pin-ready");
    };
  });

  // Movimento reduzido: a pilha vertical do CSS já é o layout correto aqui
  // (todas as 4 categorias acessíveis, sem pin/scrub) — só garante que
  // nenhuma transformação de uma execução anterior do GSAP fique presa.
  mm.add("(prefers-reduced-motion: reduce)", function () {
    var track = document.getElementById("track");
    track.classList.remove("gsap-pin-ready");
    gsap.set(track, { clearProps: "all" });
    document.querySelectorAll(".panel").forEach(function (p) {
      gsap.set(p, { clearProps: "all" });
    });
    document.querySelectorAll(".rev").forEach(function (el) {
      el.style.opacity = 1;
    });
  });
})();
