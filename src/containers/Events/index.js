import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  let filteredEvents =
    (!type
      ? data?.events
      : data?.events.filter((event) => event.type === type)) || []; // filtre quand un type est sélectionné avec les events qui ont un type égal au sélectionné
  const totalEvents = filteredEvents.length; // calcul l'ensemble des events filtré
  filteredEvents = filteredEvents.filter((event, index) => {
    if (
      (currentPage - 1) * PER_PAGE <= index &&
      PER_PAGE * currentPage > index
    ) {
      return true;
    }
    return false;
  });

  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType);
  };
  const pageNumber = Math.ceil(totalEvents / PER_PAGE); // changement du calcul par rapport à l'ensemble
  const typeList = new Set(data?.events.map((event) => event.type));
  return (
    <>
      {error && <div>An error occured</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)}
            onChange={(value) => (value ? changeType(value) : changeType(null))}
          />
          <div id="events" className="ListContainer">
            {filteredEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {[...Array(pageNumber || 0)].map((_, n) => (
              <a
                className={currentPage === n + 1 ? "active" : ""} // ajout d'une ternaire pour set une classe css qui met la page sélectionné en gras
                // eslint-disable-next-line react/no-array-index-key
                key={n}
                href="#events"
                onClick={() => setCurrentPage(n + 1)}
              >
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
