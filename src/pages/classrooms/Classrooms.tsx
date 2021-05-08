import React, {useEffect, useState} from "react";
import Header from "../../components/header/Header";
import {ClassroomsFilterTypes} from "../../models/models";
import Classroom from "../../components/classroom/Classroom";
import styles from "./classrooms.module.css";
import Caviar from "../../components/caviar/Caviar";
import {useNotification} from "../../components/notification/NotificationProvider";
import Edit from "../../components/icons/edit/Edit";
import HeaderSelect from "../../components/headerSelect/HeaderSelect";
import useClassrooms from "../../hooks/useClassrooms";
import {filterClassrooms} from "../../helpers/filterClassrooms";
import HeaderCheckbox from "../../components/headerCheckBox/HeaderCheckbox";
import Loader from "../../components/loader/Loader";

const filters = [
  {value: ClassroomsFilterTypes.ALL, label: 'Всі'},
  {value: ClassroomsFilterTypes.FREE, label: 'Вільні'},
  {value: ClassroomsFilterTypes.SPECIAL, label: 'Спеціалізовані'},
];

const Classrooms = () => {
  const classrooms = useClassrooms();
  const [filteredClassrooms, setFilteredClassrooms] = useState(classrooms);
  const [filter, setFilter] = useState(filters[0].value);
  const [isNoWing, setIsNoWing] = useState(false);
  const [isOperaStudioOnly, setIsOperaStudioOnly] = useState(false);
  const dispatchNotification = useNotification();

  useEffect(() => {
    setFilteredClassrooms(filterClassrooms(classrooms, filter, isOperaStudioOnly, isNoWing));
  }, [classrooms, filter, isNoWing, isOperaStudioOnly]);

  const handleFilterChange = (event: any) => {
    setFilter(event.value);
  };

  const handleToggleWing = () => {
    setIsNoWing(prevState => !prevState);
  };

  const handleToggleOperaStudio = () => {
    setIsOperaStudioOnly(prevState => !prevState);
  };

  return (
    <div className={styles.classroomsPage}>
      <Header>
        <h1>Аудиторії</h1>
        <HeaderSelect options={filters} onChange={handleFilterChange}/>
        <HeaderCheckbox label='Без флігеля' checked={isNoWing} setChecked={handleToggleWing}/>
        <HeaderCheckbox label='Тільки оперна студія' checked={isOperaStudioOnly}
                        setChecked={handleToggleOperaStudio}
        />
        <Edit path='/adminClassrooms'/>
      </Header>
      {!classrooms.length
        ? <Loader/>
        : <><Caviar dispatchNotification={dispatchNotification} classrooms={filteredClassrooms}/>
          <ul className={styles.classroomsList}>
            {filteredClassrooms.map((classroom) => (
              <Classroom
                dispatchNotification={dispatchNotification}
                key={classroom.id}
                classroom={classroom}
              />
            ))}
          </ul>
      </>}
    </div>
  );
};

export default Classrooms;