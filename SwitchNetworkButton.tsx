import { useEffect, useRef, useState } from "react";
import config from "../config";
import useCurrentChain from "../hooks/useCurrentChain";
import { useAccount, useSwitchChain } from "wagmi";
import { useDispatch } from "react-redux";
import { setCurrentChain } from "../store/presale";

export default function SwitchNetworkButton() {
  const chain = useCurrentChain();
  const { switchChainAsync } = useSwitchChain();
  const { isConnected } = useAccount();
  const dropDownRef = useRef<HTMLUListElement>(null);
  const dispatch = useDispatch();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const selectNetwork = (chainId: number) => {
    if (isConnected) {
      switchChainAsync?.({ chainId }).then(() =>
        dispatch(setCurrentChain(chainId))
      );
    } else {
      dispatch(setCurrentChain(chainId));
    }
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropDownRef]);

  return (
    <div className="relative">
      <button
        className="relative flex min-h-[45px] min-w-[12px] items-center justify-center rounded-full border border-[#1DDAFF] bg-transparent py-3 px-4 text-sm font-semibold uppercase leading-none text-white transition-all duration-300 ease-in-out hover:border-[#fff3] hover:bg-[#f264ff33] disabled:pointer-events-none disabled:opacity-40"
        type="button"
        onClick={() => toggleDropdown()}
      >
        <div className="flex items-center justify-between whitespace-nowrap">
          {config.chainDetails[chain.id] && (
            <img
              src={config.chainDetails[chain.id].img}
              alt={`${chain.id}`}
              className="h-[22px]"
            />
          )}
          <span className="mx-2">Buy with {chain?.nativeCurrency.symbol}</span>
          <img src="/img/angle-down.svg" alt="angle-down" />
        </div>
      </button>
      {dropdownOpen && (
        <ul
          ref={dropDownRef}
          className="absolute right-0 bottom-14 h-fit w-[220px] border-2 border-white/20 bg-black py-2 px-4"
        >
          {config.chains.map((chain) => (
            <li
              key={chain.id}
              className="flex h-[40px] cursor-pointer items-center py-2 font-semibold text-primary transition-all duration-300 ease-in-out hover:text-secondary"
              onClick={() => selectNetwork(chain.id)}
            >
              <img
                src={config.chainDetails[chain.id].img}
                alt={`${chain.id}`}
                className="mr-2.5 h-5 w-5 rounded-full border border-white object-cover"
              />
              <span className="mr-2">
                BUY WITH {chain.nativeCurrency.symbol}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
