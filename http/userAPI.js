import { $authHost, $host } from "./index"
import { jwtDecode } from "jwt-decode";

export const registration = async ({ email, password, phone, fullName, discount, limit, address, isAdmin }) => {
    const { data } = await $host.post('/api/user/register', {
        email, password, phone, fullName, discount, limit, address, isAdmin: false
    });
    localStorage.setItem('token_grodno', data.token);
    return jwtDecode(data.token);
};


export const login = async ({ email, password }) => {
    try {
        const { data } = await $host.post('/api/user/login', { email, password });

        if (data?.token) {
            localStorage.setItem('token_grodno', data.token);
            return jwtDecode(data.token);
        } else {
            return { error: 'Сервер не вернул токен' };
        }
    } catch (error) {
        if (error.response && typeof error.response.data === 'string') {
            return { error: error.response.data };
        }
        return { error: 'Ошибка входа. Попробуйте позже.' };
    }
};




export const check = async () => {
    const { data } = await $authHost.get('api/user/auth')
    localStorage.setItem('token_grodno', data.token)
    return jwtDecode(data.token)
}

export const dataUser = async () => {
    const token = localStorage.getItem('token_grodno')
    if (token) {
        const dataToken = await jwtDecode(token)
        const { data } = await $host.get('/api/user', {
            params: {
                id: dataToken.id
            }
        })
        return data
    } else {
        return null
    }
}
export const getFullUserData = async () => {
    const token = localStorage.getItem('token_grodno')
    if (token) {
        const dataToken = await jwtDecode(token)
        const { data } = await $host.get('/api/user/user-data/all/', {
            params: {
                id: dataToken.id
            }
        })
        return data
    } else {
        return null
    }
}



export const getOrdersOneClient = async (id) => {
  const { data } = await $host.get(`/api/user/user-data/all/`, {
    params: { id }
  })
  return data
}


export const dataUser2 = async (value) => {
    const token = localStorage.getItem('token_grodno');
    if (token) {
        const dataToken = jwtDecode(token);
        const id = dataToken.id;

        try {
            const { data } = await $host.post('/api/user/user-data', {
                ...value,
                userId: id,
            });

            return data;
        } catch (error) {
            console.error('Error sending user data:', error);
            return null;
        }
    } else {
        console.log('No token found');
        return null;
    }
};
export const makingAnOrder = async (orderData) => {
    try {
        const { data } = await $host.post('/api/order', orderData);
        return data;
    } catch (error) {
        console.error('Error sending user data:', error);
        return null;
    }
};



export const userData = async () => {
    const token = localStorage.getItem('token_grodno')
    if (token) {
        const dataToken = await jwtDecode(token)
        const { data } = await $host.get('/api/user/user-data', {
            params: {
                id: dataToken.id
            }
        })
        return data
    } else {
        return null
    }
}
export const orderData = async () => {
    const token = localStorage.getItem('token_grodno')
    if (token) {
        const dataToken = await jwtDecode(token)
        const { data } = await $host.get('/api/user/order', {
            params: {
                id: dataToken.id
            }
        })
        return data
    } else {
        return null
    }
}

export const getMyAccount = async () => {
    const { data } = await $authHost.get('api/user/account')
    return data
}

export const getAllUsers = async () => {
    const { data } = await $authHost.get('api/user/all-users')
    return data
}

export const resetPassword = async (login) => {
    const { data } = await $host.get('api/user/reset', {
        params: {
            login
        }
    })
    return data
}
export const newPassword = async (obj) => {
    const { data } = await $host.put('api/user/new/password', obj)
    localStorage.setItem('token_grodno', data.token)
    return jwtDecode(data.token)
}
export const returnUserProduct = async ({ buyerId, orderId, productId, quantity, reason, comment, orderItemId }) => {
	try {
		const { data } = await $host.post('/api/user/return', {
			buyerId,
			orderId,
			productId,
			orderItemId, // добавили
			quantity,
			reason,
			comment,
		});
		return data;
	} catch (error) {
		console.error('Ошибка отправки возврата:', error);
		return { error: 'Ошибка при возврате товара' };
	}
};

