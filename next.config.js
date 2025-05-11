
/** @type {import('next').NextConfig} */
const nextConfig = {
	// images: {
	//   domains: ['localhost'],
	// },
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'hi3310.ru',
			},
		],
	}
};

module.exports = nextConfig;
