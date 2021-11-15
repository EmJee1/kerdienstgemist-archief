import { computed } from 'vue'

const useDevice = () => {
	const isDevelopment = computed(
		() => import.meta.env.MODE.toLowerCase() === 'development'
	)

	return { isDevelopment }
}

export default useDevice
