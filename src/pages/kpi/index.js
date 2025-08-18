import { useLocation } from "react-router-dom";
import { KPIContent, KPIDataActive, KPIDataNotActive } from "../../components/kpi";

export default function KPI() {
  const location = useLocation();
  return (
    <>
      {location?.state?.page === "active" ? (
        <KPIDataActive dataId={location?.state?.dataId} />
      ) : location?.state?.page === "notactive" ? (
        <KPIDataNotActive dataId={location?.state?.dataId} />
      ) : (
        <KPIContent />
      )}
    </>
  );
}
