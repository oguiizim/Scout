import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import banner from "../../assets/banner.svg";
import inbr from "../../assets/inbr.svg";
import maple from "../../assets/maple.svg";
import axion from "../../assets/axion-branco.svg";
import email from "../../assets/email-branco.png";
import instagram from "../../assets/instagram-branco.png";

export default function Home() {
  const breakpoint = useBreakpoint();

  return (
    <div className="font-nunito w-full max-h-screen flex flex-col bg-[#ffffff]">
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
    <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-4">
      <img src={axion} alt="Logo Axion" className="w-40" />
    </div>
  );
}

function tabletHome() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-4">
      <img src={axion} alt="" />
    </div>
  );
}

function desktopHome() {
  return (
    <div className="font-nunito w-full max-h-screen flex flex-col bg-[#ffffff]">
      {/* Banner */}
      <div className="bg-[#ffffff]">
        {/* Container relativo */}
        <div className="relative w-full">
          {/* <img src={banner} alt="Banner" className="w-full" /> */}
          <div className="bg-[#0F172A] w-full h-145"></div>

          <div className="absolute top-40 left-30 max-w-3xl">
            <h1 className="text-6xl font-semibold mb-6">AXION SCOUTING</h1>

            <p className="hidden md:block lg:block text-base md:text-xl lg:text-normal leading-relaxed max-w-2xl">
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
              w-120
              top-10 
              right-25
            "
          />
        </div>
      </div>

      <div className="w-full py-5 flex flex-col items-center my-5">
        <div className="flex gap-8">
          <a href="https://inbr.vercel.app/" target="_blank">
            <img src={inbr} alt="Inbr" className="w-30" />
          </a>

          <a
            href="https://www.instagram.com/maple10917?igsh=bTY5ZGpudGM5ZGR3"
            target="_blank"
          >
            <img src={maple} alt="Maple" className="w-30" />
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full flex flex-col items-center">
        {/* Logos */}

        {/* Título */}
        <p className="text-black font-semibold tracking-wide mb-2">
          ENTRE EM CONTATO
        </p>

        {/* Caixa central */}
        <div
          className="
            bg-[#0F172A]
            text-white
            px-6
            py-3
            rounded-md
            flex
            items-center
            gap-6
            shadow-lg"
        >
          <div className="flex items-center gap-2">
            <img src={email} alt="Email" className="w-5 h-5" />
            <a
              href="https://mail.google.com/mail/u/0/#inbox?compose=CllgCJvlqsBKBsQZtwxXqVLHMHJlhkZBPmbzxnvZsWzxffZKSJrJFdzgMWWChplhsBlnghVlZkg"
              target="_blank"
              className="text-md hover:text-[#a2beff]"
            >
              axionsystem@gmail.com
            </a>
          </div>

          <div className="flex items-center gap-2">
            <img src={instagram} alt="Instagram" className="w-5 h-5" />
            <a
              href="https://www.instagram.com/axion_systems"
              target="_blank"
              className="text-md hover:text-[#a2beff]"
            >
              @axion_systems
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
