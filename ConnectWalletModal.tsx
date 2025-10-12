import { useEffect, useRef } from "react";
import { createTeleporter } from "react-teleporter";
import { useAccount, useConnect } from "wagmi";

type Props = {
  closeModal: Function;
};

const wallets = [
  { title: "Wallet Connect", icon: "/img/wallet-connect.svg" },
  { title: "Best Wallet", icon: "/img/bw.png" },
  { title: "MetaMask", icon: "/img/metamask.svg", hideInMobile: true },
  { title: "Coinbase Wallet", icon: "/img/coinbase.svg" },
];

const ConnectWalletModalTeleport = createTeleporter();

export function ConnectWalletModalTarget() {
  return <ConnectWalletModalTeleport.Target />;
}

export function ConnectWalletModal({ closeModal }: Props) {
  const dialog = useRef<HTMLDivElement>(null);
  const { connectors, connect } = useConnect();
  const { isConnected } = useAccount();

  const connectWallet = (walletTitle: string) => {
    const connector = connectors.find((c) => c.name === walletTitle);
    if (connector) {
      connect({ connector });
    } else {
      // Fallback to first connector if not found
      connect({ connector: connectors[0] });
    }
    // Modal will close on successful connection via useEffect
  };

  useEffect(() => {
    if (isConnected) {
      closeModal();
    }
  }, [isConnected, closeModal]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    document.addEventListener("keydown", handleEsc);
    dialog.current?.focus(); // Focus modal for accessibility

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEsc);
    };
  }, [closeModal]);

  const clickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (dialog.current && !dialog.current.contains(event.target as Node)) {
      closeModal();
    }
  };

  return (
    <ConnectWalletModalTeleport.Source>
      <div
        className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-secondary/50"
        onClick={clickOutside}
        role="presentation"
      >
        <div
          ref={dialog}
          className="w-full max-w-sm rounded-[10px] bg-black p-6 text-[#fefefe]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="connect-wallet-title"
          tabIndex={-1}
        >
          <div className="flex items-center justify-between">
            <h4 id="connect-wallet-title" className="flex-1 text-center text-lg font-semibold">
              Connect Wallet
            </h4>
            <button
              type="button"
              onClick={() => closeModal()}
              aria-label="Close modal"
            >
              <img src="/img/close-white.svg" alt="close" className="w-3.5" />
            </button>
          </div>
          <div className="mt-6">
            {wallets.map((wallet, index) => (
              <button
                type="button"
                key={index}
                className={`mb-4 min-h-[40px] w-full flex items-center justify-between gap-4 rounded-lg bg-secondary py-2 px-4 text-sm font-semibold text-white hover:bg-secondary/80 transition-colors ${wallet.hideInMobile ? "hidden lg:flex" : "flex"}`}
                onClick={() => connectWallet(wallet.title)}
                aria-label={`Connect with ${wallet.title}`}
              >
                <span>{wallet.title}</span>
                <img
                  src={wallet.icon}
                  alt={wallet.title}
                  className="h-8 w-8 object-contain"
                />
              </button>
            ))}
            <a
              href="https://ethereum.org/en/wallets/find-wallet/"
              target="_blank"
              rel="noopener noreferrer"
              className="aniBtn group mb-4 flex min-h-[40px] w-full items-center justify-center rounded-lg border border-white/20 py-2 px-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10"
            >
              <svg
                aria-hidden="true"
                width="20"
                height="19"
                viewBox="0 0 20 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: "20px", height: "19px", marginRight: "5px" }}
              >
                <path
                  d="M1.57568 4.60616C1.57568 2.69827 3.12234 1.15161 5.03023 1.15161H15.3939C17.3018 1.15161 18.8484 2.69826 18.8484 4.60616V10.3637C18.8484 12.2716 17.3018 13.8183 15.3939 13.8183H5.03023C3.12234 13.8183 1.57568 12.2716 1.57568 10.3637V4.60616Z"
                  stroke="currentColor"
                  strokeWidth="2"
                ></path>
                <path
                  d="M1 4.79293C1 2.435 3.31004 0.770014 5.54697 1.51566L12.4561 3.81869C13.8667 4.2889 14.8182 5.60901 14.8182 7.09596V13.6313C14.8182 15.9892 12.5081 17.6542 10.2712 16.9086L3.36212 14.6056C1.95149 14.1353 1 12.8152 1 11.3283V4.79293Z"
                  fill="white"
                  stroke="currentColor"
                  strokeWidth="2"
                ></path>
                <circle
                  cx="10.3863"
                  cy="10.1894"
                  r="1.32574"
                  fill="currentColor"
                ></circle>
              </svg>
              <span>I don't have a wallet</span>
            </a>
          </div>
        </div>
      </div>
    </ConnectWalletModalTeleport.Source>
  );
}