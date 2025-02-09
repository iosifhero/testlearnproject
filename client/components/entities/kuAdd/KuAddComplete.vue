<template>
  <el-scrollbar height="calc(100vh - 120px)">
    <EntitiesKuAddMain />

    <div class="button_bottom">
      <el-button @click="addClose()">Отменить</el-button>
      <el-button type="primary" @click="addItemAndSendToBackend()" :loading="loading">Создать</el-button>
    </div>

  </el-scrollbar>
</template>

<script lang="ts" setup>
import { useKuAddStore } from "~~/stores/kuAddStore";
import { useKuStore } from "~~/stores/kuStore";
import dayjs from "dayjs";

const store = useKuAddStore();
const router = useRouter();
const loading = ref(false);

//проверка полей формы
const isFormValid = () => {
  const isEmpty = (value: any) => {
    if (Array.isArray(value)) {
      return value.some((item) => item === null || item.trim() === '');
    } else {
      return value === null || String(value).trim() === '';
    }
  };

  // Проверка для каждого поля
  const isEntityNameValid = !isEmpty(store.newEntityId);
  const isNewTypeValid = !isEmpty(store.newType);
  const isNewDateStartValid = !isEmpty(store.newDateStart);
  const isNewDateEndValid = !isEmpty(store.newDateEnd);
  const isVendorNameValid = !isEmpty(store.newVendorId);

  // Возвращаем результат общей проверки
  return (
    isEntityNameValid &&
    isNewTypeValid &&
    isNewDateStartValid &&
    isNewDateEndValid &&
    isVendorNameValid
  );
};

//отправка ку на бэк
const addItemAndSendToBackend = async () => {
  // Проверяем валидность формы
  if (!isFormValid()) {
    ElMessage.error('Не все поля заполнены корректно.');
    return;
  }
  // Проверяем наличие хотя бы одного условия по товарам
  if (store.tableDataInRequirement.length === 0) {
    ElMessage.error('Добавьте минимум одно условие по товарам');
    return;
  }

  loading.value = true;
  let success = false; // Переменная для отслеживания успешности выполнения всех запросов

  try {
    // Создаем объект newItem для отправки на бэкенд
    const newItem = {
      entity_key: store.newEntityId,
      vendor_key: store.newVendorId,
      period: store.newType,
      date_start: dayjs(store.newDateStart, "DD.MM.YYYY").format("YYYY-MM-DD"),
      date_end: dayjs(store.newDateEnd, "DD.MM.YYYY").format("YYYY-MM-DD"),
      status_ku: "Создано",
    };

    // Отправляем запрос на создание нового элемента на бэкенд
    const response = await KU.postKu(newItem);

    // Создаем массив объектов для каждого элемента из tableDataInRequirement
    const requirementsArray = store.tableDataInRequirement.map(item => ({
      ku_id: response.ku_id, // используем ku_id из ответа на предыдущий запрос
      item_type: item.item_type,
      item_code: item.item_code,
      item_name: item.item_name,
      producer: item.producer,
      brand: item.brand,
    }));

    // Отправляем каждый объект из массива на бэкенд и проверяем успешность каждого запроса
    const responses = await Promise.all(requirementsArray.map(async newItem2 => {
      try {
        const response = await KU.postKuRequirement(newItem2);
        return response;
      } catch (error) {
        console.error("Ошибка при отправке условия на бэкенд:", error);
        return null;
      }
    }));

    // Проверяем успешность отправки всех объектов
    success = responses.every(response => response !== null);

    if (response && success) {
      console.log("Экземпляр успешно отправлен на бэкенд:", response);
      console.log("Условия успешно отправлены на бэкенд:", responses);
      await useKuStore().getKuFromAPIWithFilter();
      router.push("ku");

      ElMessage.success("Коммерческое условие успешно создано.");
    } else {
      console.error("Не удалось отправить экземпляр или условия на бэкенд");
      ElMessage.error("Возникла ошибка. Коммерческое условие не создано.");
      return;
    }
  } catch (error) {
    ElMessage.error("Возникла ошибка. Коммерческое условие не создано.");
    console.error("Ошибка при отправке экземпляра на бэкенд:", error);
    return;
  } finally {
    loading.value = false;
  }

  // Если все запросы были успешными, то выполняем дополнительные действия

  // Очищаем поля и таблицу условий
  store.tableDataInRequirement.length = 0;
  store.tableDataExRequirement.length = 0;
  store.tableDataPercent.length = 0;
  store.disableButtonsIncluded = false;
  store.disableButtonsExcluded = false;
  store.newEntityId = "";
  store.newVendorId = "";
  store.newType = "";
  store.newDateStart = new Date();
  store.newDateEnd = new Date();

};


//отменить
const addClose = () => {
  router.push("ku");
  store.tableDataInRequirement.length = 0;
  store.tableDataExRequirement.length = 0;
  store.tableDataPercent.length = 0;
  store.disableButtonsIncluded = false;
  store.disableButtonsExcluded = false;
  store.newEntityId = "";
  store.newVendorId = "";
  store.newType = "";
  store.newDateStart = new Date();
  store.newDateEnd = new Date();
};
</script>

<style scoped>
.button_bottom {
  margin: 20px 10px 0 0;
  display: flex;
  justify-content: flex-start;
}

.loading-cursor {
  cursor: wait;
  /* Установка курсора в виде элемента загрузки */
}

.el-popper {
  min-width: 600px !important
}

.el-vl__window {
  width: 100% !important
}
</style>
