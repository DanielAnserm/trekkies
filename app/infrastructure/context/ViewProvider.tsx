import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

export type GameView = "profile" | "game" | "postulation_badge";

export type ViewContextType = {
    currentView?: GameView;
    setCurrentView: (view: GameView) => void;
    // navigateToStart: () => void;
    navigateToProfile: () => void;
    navigateToGame: () => void;
    navigateToPostulationBadge: () => void;
};

export const ViewContext = createContext<ViewContextType>({
    currentView: "profile",
    setCurrentView: () => {},
    // navigateToStart: () => {},
    navigateToProfile: () => {},
    navigateToGame: () => {},
    navigateToPostulationBadge: () => {},
});

export const useViewContext = () => useContext(ViewContext);

const VIEW_STORAGE_KEY = "trekkie_current_view";

type Props = {
    children?: React.ReactNode;
};

export const ViewProvider = ({ children }: Props) => {
    const [currentView, setCurrentView] = useState<GameView>();
    useEffect(() => {
        const initializeView = async () => {
            try {
                // TODO: Use const
                const hasSave = localStorage.getItem("trekkie_game_save");

                if (hasSave) {
                    const savedView = localStorage.getItem(
                        VIEW_STORAGE_KEY
                    ) as GameView;
                    setCurrentView(savedView);
                } else {
                    const savedView = localStorage.getItem(
                        VIEW_STORAGE_KEY
                    ) as GameView;
                    if (
                        savedView &&
                        ["profile", "game", "postulation_badge"].includes(
                            savedView
                        )
                    ) {
                        setCurrentView(savedView);
                    } else {
                        console.log("invalid view", savedView);
                        setCurrentView("profile");
                    }
                }
            } catch (error) {
                console.error("Error initializing view:", error);
                setCurrentView("profile");
            }
        };

        initializeView();
    }, []);

    useEffect(() => {
        try {
            if (currentView) {
                localStorage.setItem(VIEW_STORAGE_KEY, currentView);
            }
        } catch (error) {
            console.error("Error saving view to storage:", error);
        }
    }, [currentView]);

    // const navigateToStart = useCallback(() => {
    //     setCurrentView("start");
    // }, []);

    const navigateToProfile = useCallback(() => {
        setCurrentView("profile");
    }, []);

    const navigateToGame = useCallback(() => {
        setCurrentView("game");
    }, []);

    const navigateToPostulationBadge = useCallback(() => {
        setCurrentView("postulation_badge");
    }, []);

    return (
        <ViewContext
            value={{
                currentView,
                setCurrentView,
                // navigateToStart,
                navigateToProfile,
                navigateToGame,
                navigateToPostulationBadge,
            }}
        >
            {children}
        </ViewContext>
    );
};
