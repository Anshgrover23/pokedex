import { useEffect, useState } from "react";

export default function AnimatedSprite({ sprites }) {
    const [currentFrame, setCurrentFrame] = useState(0);

    // Define animation sequence
    const animationSprites = [
        sprites.front_default,
        sprites.back_default,
        sprites.front_shiny,
        sprites.back_shiny,
    ].filter(Boolean); // Remove undefined/null values

    useEffect(() => {
        if (animationSprites.length === 0) return;

        const interval = setInterval(() => {
            setCurrentFrame((prevFrame) => (prevFrame + 1) % animationSprites.length);
        }, 600); // Change frames every 300ms

        return () => clearInterval(interval); // Clean up on unmount
    }, [animationSprites]);

    if (animationSprites.length === 0) {
        return <p>No animation available</p>;
    }

    return (
        <div className="animated-sprite">
            <img
                src={animationSprites[currentFrame]}
                alt="Animated Sprite"
                className="pokemon-animation"
            />
        </div>
    );
}
