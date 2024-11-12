function PinInfo({
  pinDetail,
}: {
  pinDetail: {
    id: string;
    url: string;
  };
}) {
  return (
    <>
      <div className="text-center">
        <button
          className="p-2 bg-[#e9e9e9] px-5 text-[23px]
        mt-10 rounded-full hover:scale-105 transition-all"
          onClick={() => window.open(pinDetail.url)}
        >
          Open
        </button>
      </div>
    </>
  );
}

export default PinInfo;
