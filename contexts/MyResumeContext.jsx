import deepEqual from "deep-equal";
import { nanoid } from "nanoid";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { defaultFieldValues, fieldsListRecord } from "../data/defaultFieldValues";
import { useFetch } from "../hooks/useFetch";
import { UserContext } from "../pages/context/UserContext";

const MyResumeContext = createContext({});

export const useMyResumeContext = () => useContext(MyResumeContext);

export const MyResumeContextProvider = ({ children }) => {
  const fetchStates = {
    education: useFetch(),
    work_experience: useFetch(),
    award: useFetch(),
    skill: useFetch(),
  };
  const [loading, setLoading] = useState(false);

  const user = useContext(UserContext);

  const [activeFieldEditing, setActiveFieldEditing] = useState({
    activeField: null,
    state: null
  });

  const [editedFieldsRecord, setEditedFieldsRecord] = useState(fieldsListRecord);
  const [removalRecord, setRemovalRecord] = useState(fieldsListRecord);
  const [addedFieldsRecord, setAddedFieldsRecord] = useState(fieldsListRecord);

  const closeEditing = useCallback(() => {
    setActiveFieldEditing({
      activeField: null,
      state: null
    });
  }, []);

  const onChangeEditingStateValue = useCallback((key, value) => {
    setActiveFieldEditing(prev => ({
      activeField: prev.activeField,
      state: {
        ...prev.state,
        [key]: value
      },
    }));
  }, []);

  const saveFieldItem = useCallback(() => {
    const { activeField, state } = activeFieldEditing;

    if (typeof state.id === 'number') {
      setEditedFieldsRecord(prev => ({
        ...prev,
        [activeField]: [...prev[activeField], { ...state }]
      }));
    } else if (typeof state.id === 'string') {
      setAddedFieldsRecord(prev => ({
        ...prev,
        [activeField]: [...prev[activeField], { ...state }]
      }));
    }

    fetchStates[activeField].setData(prevData => {
      if (!prevData || !prevData.length) {
        return [state];
      }
      const duplicateData = prevData.find(fieldData => {
        const fieldDataCopy = { ...fieldData };
        const newDataCopy = { ...state };
        delete fieldDataCopy['id'];
        delete newDataCopy['id'];
        return deepEqual(fieldDataCopy, newDataCopy);
      });
      if (duplicateData) {
        return prevData;
      }
      const matchingDataIndex = prevData.findIndex(fieldData => {
        return state.id === fieldData.id
      });
      if (matchingDataIndex > -1) {
        prevData = prevData.slice();
        prevData[matchingDataIndex] = state;
        return prevData;
      }
      return [...(prevData || []), state];
    });

    closeEditing();
  }, [activeFieldEditing]);

  const addOrEditFieldItem = (field, editingId) => {
    if (!(field in fetchStates)) return;

    let formState = {
      ...defaultFieldValues[field],
      user: user.id,
      id: nanoid(4),
    };
    if (editingId) {
      formState = fetchStates[field].data?.find((fieldData) => (
        fieldData.id === editingId
      ));
    }

    setActiveFieldEditing({
      activeField: field,
      state: formState
    });
  };

  const batchFetchUpdate = useCallback(
    async (record, reqOptions, withId = true) => {
      const promises = Object.keys(record).map(async fieldKey => {
        const updatePromises = record[fieldKey].map(async item => {
          return fetchStates[fieldKey].makeRequest(
            `/${fieldKey}/${withId ? `${item.id}/` : ''}`,
            {
              body: JSON.stringify(item),
              headers: {
                'Content-Type': 'application/json'
              },
              ...reqOptions,
            },
            true
          );
        });
        return Promise.all(updatePromises);
      });
      return Promise.all(promises);
    }, [removalRecord]
  );

  const saveFieldsToDb = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      batchFetchUpdate(removalRecord, { method: 'DELETE' }),
      batchFetchUpdate(editedFieldsRecord, { method: 'PATCH' }),
      batchFetchUpdate(addedFieldsRecord, { method: 'POST' }, false),
    ]);
    setLoading(false);
  }, [batchFetchUpdate, removalRecord, addedFieldsRecord, editedFieldsRecord]);

  const removeFieldItem = useCallback((field, item) => {
    if (!(field in fetchStates)) return;

    fetchStates[field].setData(prev => prev && (
      prev.filter(fieldData => fieldData.id !== item.id)
    ));

    setRemovalRecord(prev => {
      return {
        ...prev,
        [field]: [...prev[field], item]
      };
    });
  }, []);

  const filteredFetch = useCallback(async (fetch, url) => {
    let fetchedData = await fetch.makeRequest(url, undefined, true);
    if (fetchedData instanceof Array) {
      fetchedData = fetchedData.filter(data => {
        if ('user' in data) {
          return data.user === user?.id;
        }
        return true;
      });
    }
    fetch.setData(fetchedData);
  }, [user]);

  useEffect(() => {
    setLoading(true);
    if (user) {
      Promise.all([
        filteredFetch(fetchStates.education, '/education/'),
        filteredFetch(fetchStates.work_experience, '/work_experience/'),
        filteredFetch(fetchStates.award, '/award/'),
        filteredFetch(fetchStates.skill, '/skill/'),
      ]).finally(() => setLoading(false));
    }
  }, [filteredFetch]);

  const state = {
    fetchStates,
    removalRecord,
    activeFieldEditing,
    removeFieldItem,
    addOrEditFieldItem,
    saveFieldItem,
    closeEditing,
    onChangeEditingStateValue,
    saveFieldsToDb,
    loading,
    setLoading,
  };

  return (
    <MyResumeContext.Provider value={state}>
      {children}
    </MyResumeContext.Provider>
  );
};