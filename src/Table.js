import React from "react";
import "./Table.css";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import { prettyPrintStat } from "./util";

const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = React.useState(config);

  const sortedItems = React.useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};

const ProductTable = (props) => {
  const { items, requestSort, sortConfig } = useSortableData(props.countries);
  const getClassNamesFor = (country) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === country ? sortConfig.direction : undefined;
  };
  return (
    <div className="table">
      <table className="table__table sortable" id="myTable">
        <thead>
          <tr>
            <th>
              <button
                type="button"
                onClick={() => requestSort("country")}
                className={getClassNamesFor("country")}
              >
                Country
              </button>
            </th>
            <th>
              <button
                type="button"
                onClick={() => requestSort("cases")}
                className={getClassNamesFor("cases")}
              >
                cases
              </button>
            </th>
            <th>
              <button
                type="button"
                onClick={() => requestSort("recovered")}
                className={getClassNamesFor("recovered")}
              >
                recovered
              </button>
            </th>
            <th>
              <button
                type="button"
                onClick={() => requestSort("deaths")}
                className={getClassNamesFor("deaths")}
              >
                deaths
              </button>
            </th>
          </tr>
        </thead>
        <tbody className="table__body">
          {items.map(
            ({
              countryInfo,
              country,
              cases,
              recovered,
              deaths,
              todayCases,
            }) => (
              <tr>
                <td className="table__column">
                  <div
                    className="table__flag"
                    style={{ backgroundImage: `url(${countryInfo.flag})` }}
                  ></div>
                  <div className="table__data">
                    <div className="table__row">{country}</div>
                    <div className="table__today">
                      <ArrowUpwardIcon style={{ fill: "red" }} />
                      {todayCases}
                    </div>
                  </div>
                </td>

                <td className="table__body__column">
                  <strong>{prettyPrintStat(cases)}</strong>
                </td>
                <td className="table__body__column">
                  <strong>{prettyPrintStat(recovered)}</strong>
                </td>
                <td className="table__body__column">
                  <strong>{prettyPrintStat(deaths)}</strong>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

function Table({ countries }) {
  return <ProductTable countries={countries} />;
}

export default Table;
