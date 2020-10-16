/**
 * Set storage
 *
 * @param name
 * @param content
 * @param maxAge
 */
export const setStore = (name, content) => {
  if (!content || !name) {
    return;
  }
  
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
	try {
		uni.setStorageSync(name, content);
	} catch (e) {
		console.error("setStore error", name, e)
	}
	/*
	//异步缓存
	uni.setStorage({
		key: name,
		data: content,
		success: function () {
			console.log(name + " setStorage success!");
		}
	});*/
};

/**
 * Get storage
 *
 * @param name
 * @returns {*}
 */
export const getStore = name => {
  if (!name) {
    return;
  }

	try {
		const value = uni.getStorageSync(name);
		if (value) {
			try {
				return JSON.parse(value)
			} catch (e) {
				return value
			}
		}
	} catch (e) {
		console.error("getStore error", name, e)
	}
	return;
};

/**
 * Clear storage
 *
 * @param name
 */
export const clearStore = name => {
  if (!name) {
    return;
  }
	try {
		uni.removeStorageSync(name);
	} catch (e) {
		console.error("clearStore error", name, e)
	}
};
