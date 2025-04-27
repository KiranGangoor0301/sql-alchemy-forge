
interface TitleProps {
  isAnimated: boolean;
}

export const Title = ({ isAnimated }: TitleProps) => {
  const fadeInClass = isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4';

  return (
    <div className={`text-center mb-12 mt-8 transition-all duration-700 ease-out ${fadeInClass}`}>
      <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent transform hover:scale-105 transition-transform duration-300">
        Sybase ➔ Oracle SQL Converter
      </h1>
      <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
        Transform your Sybase SQL files into Oracle SQL format with ease and precision
      </p>
    </div>
  );
};
