// my-app/http/adminAPI.js
import { $authHost, $host } from "./index"
import { normalizeProducts } from '@/lib/normalizeProduct';

export const getAllFilterCars = async (filterParams) => {
	try {
		const response = await fetch('/api/cars/filter', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(filterParams),
		});
		if (!response.ok) {
			throw new Error(`Ошибка HTTP: ${response.status}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Ошибка при получении отфильтрованных автомобилей:', error);
		throw error;
	}
};


export const addCategory = async (title) => {
	const { data } = await $authHost.post('api/admin/category', title)
	return data
}
export const getAllCategory = async () => {
	const { data } = await $host.get('api/admin/category')
	return data
}
export const getAllCategoryAndGroup = async () => {
	const { data } = await $host.get('api/admin/category/all/')
	return data
}
export const addGroup = async (obj) => {
	const { data } = await $authHost.post('api/admin/group', obj)
	return data
}
export const editGroup = async (id, title) => {
	try {
		const { data } = await $authHost.put('api/admin/group/' + id, { title });
		return data;
	} catch (error) {
		console.error("Ошибка при редактировании группы:", error);
		throw error;
	}
};
export const editCategory = async (id, title) => {
	try {
		const { data } = await $authHost.put('api/admin/category/' + id, { title });
		return data;
	} catch (error) {
		console.error("Ошибка при редактировании категории:", error);
		throw error;
	}
};

export const createOneProduct = async (obj) => {
	const { data } = await $authHost.post('api/admin/product/one', obj)
	return data
}

export const deleteGroup = async (id) => {
	try {
		const { data } = await $authHost.delete('api/admin/group/' + id);
		return data;
	} catch (error) {
		console.error("Ошибка при удалению группы:", error);
		throw error;
	}
};

export const deleteCategory = async (id) => {
	try {
		const { data } = await $authHost.delete('api/admin/category/' + id);
		return data;
	} catch (error) {
		console.error("Ошибка при удалению категории:", error);
		throw error;
	}
};

export const getAllGroupOneCategory = async (id) => {
	const { data } = await $host.get('api/admin/group/' + id)
	return data
}

export const uploadPriceProduct = async (obj) => {
	const { data } = await $authHost.post('api/admin/product', obj)
	return data
}

export const editDiscountGroup = async (obj) => {
	const { data } = await $authHost.put('api/admin/group', obj)
	return data
}

export const editUserDataAdmin = async ({ email, password, phone, fullName, discount, limit, address, isAdmin }) => {
    const { data } = await $host.post('/api/admin/user', {
        email, password, phone, fullName, discount, limit, address, isAdmin: false
    });
    return data
};


export async function getAllProducs() {
  const res = await fetch('/api/product', { cache: 'no-store' });
  if (!res.ok) return [];
  const json = await res.json();
  const list = Array.isArray(json?.products) ? json.products : [];
  return normalizeProducts(list); // ← images становится массивом
}


export const getAllPendingOrders = async () => {
	try {
		const response = await $authHost.get('api/order');
		return response.data;
	} catch (error) {
		console.error('Ошибка при получении всех заказов:', error);
		throw error;
	}
};


export const updateOneProduct = async (product) => {
	const { data } = await $authHost.put('api/admin/product/one/', product)
	return data
}

export const getOneProduct = async (id) => {
	const { data } = await $host.get('api/admin/product/' + id)
	return data
}
export const getRecommendedProduct = async () => {
	const { data } = await $host.get('api/product/recommended')
	return data
}

export const deleteOneCar = async (id) => {
	const { data } = await $authHost.delete('api/cars/' + id)
	return data
}

export const GetGoogle = async () => {
	try {
		const { data } = await $host.get('/api/price');
		return data;
	} catch (err) {
		console.error("🚀 🚀 🚀  _ GetGoogle _ ошибка:", err);
		throw err;
	}
};



export const getAllReturns = async (status = 'pending') => {
  // status: 'pending' | 'approved' | 'rejected' | 'all'
  const query =
    status && status !== 'all'
      ? `?status=${encodeURIComponent(status)}`
      : '';
  const { data } = await $authHost.get(`/api/admin/returns${query}`);
  return data;
};

export const updateReturnStatus = async ({ returnId, action }) => {
  // action: 'approve' | 'reject'
  const { data } = await $authHost.patch('/api/admin/returns', {
    returnId,
    action,
  });
  return data;
};
