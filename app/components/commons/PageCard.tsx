import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface PageType {
  id: number;
  title: string;
  url: string;
  maxPage: number;
}

const PageCard = ({ item }: { item: PageType }) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/pages/${item.id}`);
  };

  return (
    <Card className="w-[350px] flex flex-col justify-evenly">
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{item.url}</CardDescription>
      </CardContent>
      <CardFooter>
        <button onClick={handleClick}>View</button>
      </CardFooter>
    </Card>
  );
};

export default PageCard;
