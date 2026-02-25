import { useEffect, useState } from "react";
import { AtSign, Mail } from "lucide-react";
import Navbar from "../Components/Navbar";
import banner from "../../assets/banner.svg";
import inbr from "../../assets/inbr.svg";
import maple from "../../assets/maple.svg";
import axion from "../../assets/axion-branco.png";
import email from "../../assets/email-branco.png";

export default function Home() {
  const breakpoint = useBreakpoint();

  return (
    <div className="font-nunito w-full max-h-screen flex flex-col bg-background">
      <Navbar />
      {breakpoint === "mobile" && mobileHome()}
      {breakpoint === "tablet" && tabletHome()}
      {breakpoint === "desktop" && desktopHome()}
    </div>
  );
}

function useBreakpoint() {
  const [breakpoint, setBp] = useState("desktop");

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 639px)");
    const tablet = window.matchMedia(
      "(min-width: 640px) and (max-width: 1023px)",
    );

    const update = () => {
      if (mobile.matches) return setBp("mobile");
      if (tablet.matches) return setBp("tablet");
      return setBp("desktop");
    };

    update();
    mobile.addEventListener("change", update);
    tablet.addEventListener("change", update);

    return () => {
      mobile.removeEventListener("change", update);
      tablet.removeEventListener("change", update);
    };
  }, []);

  return breakpoint;
}

function mobileHome() {
  return (
    <div className="w-full flex flex-col min-h-screen bg-background">
      <div className="bg-darkblue w-full flex flex-col items-center justify-center">
        <img
          src={axion}
          alt="Logo Axion"
          className="w-50 items-center justify-center mx-auto my-4"
        />
        <h1 className="text-hometext text-xl font-bold">AXION SCOUTING</h1>
        <div className="m-4 rounded-2xl shadow-lg">
          <p className="text-hometext text-normal leading-relaxed max-w-2xl px-5 py-4 text-justify">
            Axion Scouting é uma plataforma de scouting desenvolvida para
            equipes de robótica. Com uma interface intuitiva e recursos
            avançados, perfeito para análises de alto nivel durante todo o
            campeonato. Assegurando que sua equipe esteja sempre com as melhores
            estratégias e informações.
          </p>
        </div>
      </div>

      <div className="w-full py-5 flex flex-col items-center bg-background">
        <div className="flex gap-8">
          <a href="https://inbr.vercel.app/" target="_blank">
            <img src={inbr} alt="Inbr" className="w-28" />
          </a>

          <a
            href="https://www.instagram.com/maple10917?igsh=bTY5ZGpudGM5ZGR3"
            target="_blank"
          >
            <img src={maple} alt="Maple" className="w-28" />
          </a>
        </div>
      </div>

      <div className="w-full flex flex-col items-center bg-background">
        <p className="text-hometext font-semibold tracking-wide mb-2">
          ENTRE EM CONTATO
        </p>

        <div
          className="
            bg-darkblue text-hometext px-6 py-3 rounded-md flex flex-col items-center gap-6 shadow-lg mb-3"
        >
          <div className="flex items-center gap-2">
            <Mail/>
            <a
              href="https://mail.google.com/mail/u/0/#inbox?compose=CllgCJvlqsBKBsQZtwxXqVLHMHJlhkZBPmbzxnvZsWzxffZKSJrJFdzgMWWChplhsBlnghVlZkg"
              target="_blank"
              className="text-md hover:text-linktext"
            >
              axionsystem@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-2">
            <AtSign/>
            <a
              href="https://www.instagram.com/axion_systems"
              target="_blank"
              className="text-md hover:text-linktext"
            >
              @axion_systems
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function tabletHome() {
  return (
    <div className="w-full min-h-screen flex flex-col gap-6">
      <div className="bg-darkblue w-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <h1 className="text-hometext text-2xl font-bold">AXION SCOUTING</h1>
          <div className="bg-[#12244d] m-4 rounded-2xl shadow-lg">
            <p className="text-hometext text-xl leading-relaxed px-5 py-2 text-justify">
              Axion Scouting é uma plataforma de scouting desenvolvida para
              equipes de robótica. Com uma interface intuitiva e recursos
              avançados, perfeito para análises de alto nivel durante todo o
              campeonato. Assegurando que sua equipe esteja sempre com as
              melhores estratégias e informações.
            </p>
          </div>
        </div>
        <img
          src={axion}
          alt="Logo Axion"
          className="w-90 items-center justify-center mx-auto my-4"
        />
      </div>

      <div className="w-full py-5 flex flex-col items-center my-5">
        <div className="flex gap-8">
          <a href="https://inbr.vercel.app/" target="_blank">
            <img src={inbr} alt="Inbr" className="w-35" />
          </a>

          <a
            href="https://www.instagram.com/maple10917?igsh=bTY5ZGpudGM5ZGR3"
            target="_blank"
          >
            <img src={maple} alt="Maple" className="w-35" />
          </a>
        </div>
      </div>

      <div className="w-full flex flex-col items-center text-xl">
        <p className="text-text font-semibold tracking-wide mb-2">
          ENTRE EM CONTATO
        </p>

        <div
          className="
            bg-darkblue text-hometext px-6 py-3 rounded-md flex items-center gap-6 shadow-lg mb-3"
        >
          <div className="flex items-center gap-2">
            <Mail/>
            <a
              href="https://mail.google.com/mail/u/0/#inbox?compose=CllgCJvlqsBKBsQZtwxXqVLHMHJlhkZBPmbzxnvZsWzxffZKSJrJFdzgMWWChplhsBlnghVlZkg"
              target="_blank"
              className="hover:text-linktext"
            >
              axionsystem@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-2">
            <AtSign/>
            <a
              href="https://www.instagram.com/axion_systems"
              target="_blank"
              className="hover:text-linktext"
            >
              @axion_systems
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function desktopHome() {
  return (
    <div className="font-nunito w-full overflow-y-hidden flex flex-col bg-background">
      {/* Banner */}
      <div className="bg-background">
        {/* Container relativo */}
        <div className="relative w-full">
          {/* <img src={banner} alt="Banner" className="w-full" /> */}
          <div className="bg-darkblue w-full h-145"></div>

          <div className="absolute top-40 left-30 w-130">
            <h1 className="text-hometext text-6xl font-semibold mb-6">
              AXION SCOUTING
            </h1>

            <p className="text-hometext text-normal leading-relaxed text-justify max-w-full">
              Axion Scouting é uma plataforma de scouting desenvolvida para
              equipes de robótica, oferecendo uma solução completa para coleta,
              análise e visualização de dados de desempenho. Com uma interface
              intuitiva e recursos avançados, o Axion Scouting torna possivel,
              melhorar estratégias e alcançar resultados excepcionais em
              competições de robótica.
            </p>
          </div>

          {/* Logo por cima */}
          <img
            src={axion}
            alt="Logo Axion"
            className="
              absolute
              w-130
              top-5 
              right-20
            "
          />
        </div>
      </div>

      <div className="w-full py-5 flex flex-col items-center mt-5">
        <div className="flex gap-8">
          <a href="https://inbr.vercel.app/" target="_blank">
            <img src={inbr} alt="Inbr" className="w-35" />
          </a>

          <a
            href="https://www.instagram.com/maple10917?igsh=bTY5ZGpudGM5ZGR3"
            target="_blank"
          >
            <img src={maple} alt="Maple" className="w-35" />
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full flex flex-col items-center bg-background p-2">
        {/* Logos */}

        {/* Título */}
        <p className="text-text font-semibold tracking-wide mb-2">
          ENTRE EM CONTATO
        </p>

        <div
          className="
            bg-darkblue text-hometext px-6 py-3 rounded-md flex items-center gap-6 shadow-lg mb-3"
        >
          <div className="flex items-center gap-2">
            <Mail/>
            <a
              href="https://mail.google.com/mail/u/0/#inbox?compose=CllgCJvlqsBKBsQZtwxXqVLHMHJlhkZBPmbzxnvZsWzxffZKSJrJFdzgMWWChplhsBlnghVlZkg"
              target="_blank"
              className="text-md hover:text-linktext"
            >
              axionsystem@gmail.com
            </a>
          </div>

          <div className="flex items-center gap-2">
            <AtSign/>
            <a
              href="https://www.instagram.com/axion_systems"
              target="_blank"
              className="text-md hover:text-linktext"
            >
              @axion_systems
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
