import { useState, useCallback, useEffect, useRef } from "react";
import { useGameState } from "./hooks/use-game-state";
import { SetupScreen } from "./components/setup-screen";
import { GameBoard } from "./components/game-board";
import { MoveCounter } from "./components/move-counter";
import { CompletionScreen } from "./components/completion-screen";
import type { BoardConfig, UploadedImage } from "./types/game";

export default function App() {
  const { state, startGame, selectCard, reset } = useGameState();
  const [images, setImages] = useState<UploadedImage[]>([]);
  const imagesRef = useRef(images);
  imagesRef.current = images;

  useEffect(() => {
    return () => {
      for (const img of imagesRef.current) {
        URL.revokeObjectURL(img.url);
      }
    };
  }, []);

  const handleAddImages = useCallback((files: File[]) => {
    const newImages: UploadedImage[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const handleRemoveImage = useCallback((id: string) => {
    setImages((prev) => {
      const image = prev.find((img) => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.url);
      }
      return prev.filter((img) => img.id !== id);
    });
  }, []);

  const handleReorderImage = useCallback(
    (id: string, direction: "up" | "down") => {
      setImages((prev) => {
        const index = prev.findIndex((img) => img.id === id);
        if (index === -1) return prev;
        const swapIndex = direction === "up" ? index - 1 : index + 1;
        if (swapIndex < 0 || swapIndex >= prev.length) return prev;
        const next = [...prev];
        [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
        return next;
      });
    },
    [],
  );

  const handleStart = useCallback(
    (config: BoardConfig, imageUrls: readonly string[]) => {
      startGame(config, imageUrls);
    },
    [startGame],
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      {state.phase === "setup" && (
        <SetupScreen
          images={images}
          onAddImages={handleAddImages}
          onRemoveImage={handleRemoveImage}
          onReorderImage={handleReorderImage}
          onStart={handleStart}
        />
      )}

      {state.phase === "complete" && (
        <CompletionScreen moveCount={state.moveCount} onPlayAgain={reset} />
      )}

      {state.phase !== "setup" && state.phase !== "complete" && (
        <div className="flex flex-col items-center py-4 gap-4">
          <MoveCounter moveCount={state.moveCount} />
          <GameBoard
            cards={state.cards}
            cols={state.config.cols}
            onSelectCard={selectCard}
            onReset={reset}
          />
        </div>
      )}
    </div>
  );
}
