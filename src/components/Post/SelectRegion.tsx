import axios from "axios";
import { useEffect, useState } from "react";

interface RegionType {
  id: number;
  sido: string;
  sigg: string;
}

interface SelectRegionProps {
  regionId: number;
  address: string;
  setRegionId: (value: number) => void;
  setAddress: (value: string) => void;
}

const SelectRegion = (props: SelectRegionProps) => {
  const URL = "http://localhost:8080";

  const { regionId, address, setRegionId, setAddress } = props;

  const [regions, setResions] = useState<RegionType[] | null>(null);
  const [sidos, setSidos] = useState<string[]>([]);
  const [siggs, setSiggs] = useState<RegionType[] | null>(null);

  // 지역 데이터 가져오기
  useEffect(() => {
    (async () => {
      try {
        const serverUrl = `${URL}/regions`;
        const response = await axios.get(serverUrl);
        setResions(response.data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  // 지역 데이터를 불러왔을 때 모든 Sido들 중복되지 않게 가져오기
  useEffect(() => {
    if (!regions) return;

    const allSidos: string[] = [];
    regions.forEach((region) => {
      if (!allSidos.includes(region.sido)) {
        allSidos.push(region.sido);
      }
    });

    setSidos(allSidos);
  }, [regions]);

  //
  useEffect(() => {
    if (!regions || !address) return;

    const siggsBySido = regions.filter((region) => region.sido === address.split(" ")[0]);
    setSiggs(siggsBySido);
  }, [address, regions]);

  // Sido가 변경되었을 때 Sigg 값 변경
  const changeSido = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!regions) return;

    setRegionId(0);
    setAddress(e.target.value);
  };

  // Sigg 변경되었을 때 함수
  const changeSigg = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value.split(" ");

    setRegionId(Number(value[0]));
    setAddress(`${address.split(" ")[0]} ${value[1]}`);
  };

  return (
    <div>
      <div className="mt-4 mb-2 text-base">지역</div>
      <div className="flex gap-2">
        <select
          onChange={changeSido}
          value={address.split(" ")[0]}
          className="px-0.5 py-0.5 w-28 border-2 border-inherit rounded-xl text-sm focus:outline-main-400"
        >
          <option className="px-0.5 py-0.5 text-sm">선택</option>
          {sidos.map((sido) => {
            return (
              <option className="px-0.5 py-0.5 text-sm" key={sido}>
                {sido}
              </option>
            );
          })}
        </select>
        <select
          onChange={changeSigg}
          value={`${regionId} ${address.split(" ")[1]}`}
          className="px-0.5 py-0.5 w-28 border-2 border-inherit rounded-xl text-sm focus:outline-main-400"
        >
          <option className="px-0.5 py-0.5 text-sm" value={"0 선택"}>
            선택
          </option>
          {siggs &&
            siggs.map((sigg) => {
              return (
                <option className="px-0.5 py-0.5 text-sm" key={sigg.id} value={`${sigg.id} ${sigg.sigg}`}>
                  {sigg.sigg}
                </option>
              );
            })}
        </select>
      </div>
    </div>
  );
};

export default SelectRegion;
