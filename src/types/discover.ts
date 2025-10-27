export interface TabData {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  leftImage: string;
  rightImage: string;
  portfolioItems: PortfolioItem[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  likes: number;
  views: number;
}
