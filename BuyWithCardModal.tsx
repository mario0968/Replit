import { useEffect, useRef } from "react";
import CloseIcon from "../assets/svg/ModalClose.svg?react";
import { createTeleporter } from "react-teleporter";

type Props = {
  closeModal: Function;
};

const BuyWithCardModalTeleport = createTeleporter();

export function BuyWithCardModalTarget() {
  return <BuyWithCardModalTeleport.Target />;
}

export function BuyWithCardModal({ closeModal }: Props) {
  const dialog: any = useRef();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const clickOutside = (event: any) => {
    const childElement = dialog.current;
    if (
      event.target instanceof HTMLElement &&
      !childElement?.contains(event.target)
    ) {
      closeModal();
    }
  };
  return (
    <BuyWithCardModalTeleport.Source>
      <div
        className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-backdrop/50"
        onClick={clickOutside}
      >
        <div ref={dialog} className="card w-full max-w-xl">
          <h4 className="mx-3 mt-2 mb-4 flex items-center justify-between text-xl font-bold uppercase text-white">
            <span>Buy BNB with card</span>
            <CloseIcon
              className="cursor-pointer hover:opacity-80"
              onClick={() => closeModal()}
            />
          </h4>
          <iframe
            title="Transak"
            id="transak"
            allow="accelerometer; autoplay; camera; gyroscope; payment"
            height="750"
            className="block w-full rounded-lg border"
            src="https://global.transak.com/"
          >
            <p>Your browser does not support iframes.</p>
          </iframe>
        </div>
      </div>
    </BuyWithCardModalTeleport.Source>
  );
}
