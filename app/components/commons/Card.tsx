export interface PageType {
  id: number;
  title: string;
  url: string;
  maxPage: number;
}

const Card = ({ item }: { item: PageType }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{item.title}</div>
        <p className="text-gray-700 text-base">{item.url}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          ID: {item.id}
        </span>
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          Max Page: {item.maxPage}
        </span>
      </div>
    </div>
  );
};

export default Card;
