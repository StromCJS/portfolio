import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import Loading, { setProgress } from "../components/Loading";

interface LoadingType {
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  setLoading: (percent: number) => void;
}

export const LoadingContext = createContext<LoadingType | null>(null);

export const LoadingProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(0);

  // The loader used to be driven by the 3D character download. With that gone,
  // real signals are webfonts + window load, with a hard ceiling so the screen
  // can never get stuck.
  useEffect(() => {
    const progress = setProgress(setLoading);
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      progress.loaded();
    };

    const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
    const windowLoad =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) =>
            window.addEventListener("load", () => resolve(), { once: true })
          );

    Promise.all([fonts, windowLoad]).then(finish);
    const ceiling = setTimeout(finish, 4000);

    return () => {
      clearTimeout(ceiling);
      if (!settled) progress.clear();
    };
  }, []);

  const value = {
    isLoading,
    setIsLoading,
    setLoading,
  };

  return (
    <LoadingContext.Provider value={value as LoadingType}>
      {isLoading && <Loading percent={loading} />}
      <main className="main-body">{children}</main>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
