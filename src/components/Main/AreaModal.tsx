interface Region {
  sido: string;
  sigg: string;
  regionId: number;
}

interface AreaModalProps {
  regionList: Region[];
  handleRegionArea: (region: Region) => void;
}

const AreaModal = ({ regionList, handleRegionArea }: AreaModalProps) => {
  const regionListSidoes = regionList.map((r) => {
    return r.sido;
  });

  const regionListSido = regionListSidoes.filter((el, i) => {
    return regionListSidoes.indexOf(el) === i;
  });

  return (
    <>
      <section className="flex absolute  w-full  border-t border-gray bg-white z-10 shadow">
        <div className="px-3 py-2 w-36 bg-main-300">
          <ul>{regionListSido}</ul>
        </div>

        <ul className="w-full grid gap-1 grid-cols-3 min-[320px]:grid-cols-4 sm:grid-cols-5  md:grid-cols-6 lg:grid-cols-7">
          {regionList.map((region) => {
            return (
              <li key={region.regionId} className=" mb-1 text-sm text-center cursor-pointer" onClick={() => handleRegionArea(region)}>
                {region.sigg}
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
};

export default AreaModal;
