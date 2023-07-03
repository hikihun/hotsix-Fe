import { useEffect, useState } from "react";
import { createLoginConfig } from "../API/AxiosModule";

interface RegionOption {
  id: number;
  sido: string;
  sigg: string;
}

interface RegionProps {
  handleRegionIdChange: (regionId: number | null) => void;
  defaultRegionId: number | null;
}

const Region = ({ handleRegionIdChange, defaultRegionId }: RegionProps) => {
  const [regionOptions, setRegionOptions] = useState<RegionOption[]>([]);
  const [sido, setSido] = useState<string>("");
  const [sigg, setSigg] = useState<string>("");
  const [regionId, setRegionId] = useState<number | null>(defaultRegionId);

  useEffect(() => {
    const fetchData = async () => {
      createLoginConfig("get", "regions", "").then((response) => {
        setRegionOptions(response.data);
      });
    };
    fetchData();
  }, []);

  useEffect(() => {
    handleRegionIdChange(regionId);
  }, [regionId, handleRegionIdChange]);

  useEffect(() => {
    const selectedRegion = regionOptions.find((option) => option.id === defaultRegionId);
    if (selectedRegion) {
      setSido(selectedRegion.sido);
      setSigg(selectedRegion.sigg);
      setRegionId(selectedRegion.id);
    }
  }, [regionOptions, defaultRegionId]);

  const handleSiggChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSigg = e.target.value;
    setSigg(selectedSigg);
    const selectedRegion = regionOptions.find((option) => option.sido === sido && option.sigg === selectedSigg);
    if (selectedRegion && selectedRegion.id !== regionId) {
      setRegionId(selectedRegion.id);
    }
  };

  const handleSidoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSido = e.target.value;
    setSido(selectedSido);
    setSigg("");
  };

  const uniqueSidoOptions = Array.from(new Set(regionOptions.map((option) => option.sido)));

  return (
    <div className="flex flex-col mt-5 items-center">
      <label htmlFor="input-region" className="w-9/12 after:content-['*'] after:text-red-500">
        원하는 지역
      </label>
      <div className="flex justify-between mt-2 w-9/12">
        <select onChange={handleSidoChange} className="py-1 w-5/12 text-sm" id="input-region" value={sido}>
          <option>시도</option>
          {uniqueSidoOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select onChange={handleSiggChange} className="w-5/12 text-sm" value={sigg}>
          <option disabled>시군구</option>
          {regionOptions
            .filter((option) => option.sido === sido)
            .map((option) => (
              <option key={option.id} value={option.sigg}>
                {option.sigg}
              </option>
            ))}
        </select>
      </div>
      <input type="text" name="regionId" className="hidden" defaultValue={regionId !== null ? String(regionId) : ""} />
    </div>
  );
};

export default Region;
