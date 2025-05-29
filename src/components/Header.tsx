
import { Wheat } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b border-border/50 bg-card/30 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gluten-primary to-gluten-secondary rounded-full flex items-center justify-center">
            <Wheat className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">GlutenConvert</h1>
            <p className="text-sm text-muted-foreground">Smart Recipe Companion</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
