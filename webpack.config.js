const path = require('path'); // 절대 경로를 참조하기 위해

// 웹팩에서 HTML을 다루기 위한 플러그인
// 플러그인은 script 태그를 사용하여 body에 모든 webpack 번들을 포함하는 HTML5파일을 생성합니다.
// 적용은 webpack에 플러그인을 추가하기만 하면 됩니다.

// 자세한 설명 링크: https://webpack.kr/plugins/html-webpack-plugin/
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// ts-loader의 성능 향상을 위한 라이브러리
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const { DefinePlugin, EnvironmentPlugin } = require('webpack');

module.exports = {
	mode: process.env.NODE_ENV,
	// Bundle(하나로 합치기)을 만들기 위한 시작 파일
	entry: ['./src/index.tsx'],

	// 생성된 번들 파일은 /dist폴더에 생성됩니다.
	// publicPath를 지정함으로써 HTML 등
	// 다른 파일에서 생성된 번들을 참조할 때, '/'를 기준으로 참조합니다.
	// ex) <script type="text/javascript" src="/js/app.js"></script>
	output: {
		path: path.resolve(__dirname, 'dist/'),
		publicPath: '/',
	},

	// 확장자를 순서대로 해석합니다. 여러 파일에서 이름이 동일하지만 다른 확장자를 가진 경우,
	// webpack은 배열의 앞에서부터 파일을 해석하고 남은 것은 해석하지 않습니다.
	// webpack resolve에 대한 자세한 내용: https://webpack.kr/configuration/resolve/
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
		extensions: ['.tsx', '.ts', '.jsx', '.js', 'json'],
	},

	// React파일인 jsx, js는 babel을 이용하여 빌드합니다.
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				use: [
					'babel-loader',
					{
						loader: 'ts-loader',
						options: {
							transpileOnly: true,
						},
					},
				],
				exclude: /node_modules/,
			},
			{
				// 이미지 파일 로더
				test: /\.(jpg|jpeg|gif|png|svg|ico)?$/i,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 10000, // 파일 사이즈가 10k보다 작은 경우 문자열로 만들어 사용하는 부분에 직접 삽입(번들로)
							fallback: 'file-loader', // 파일 사이즈가 10k 보다 큰 경우, file-loader를 이용하여 파일 복사
							name: 'images/[name].[ext]', // 복사할 때 파일을 이미지(image)폴더에 파일명(name)과 확장자(ext) 형태로 복사합니다.
						},
					},
				],
			},
			{
				// 폰트 로더
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 10000, // 파일 사이즈가 10k보다 작은 경우 문자열로 만들어 사용하는 부분에 직접 삽입(번들로)
							fallback: 'file-loader', // 파일 사이즈가 10k 보다 큰 경우, file-loader를 이용하여 파일 복사
							name: 'fonts/[name].[ext]', // 복사할 때 파일을 이미지(image)폴더에 파일명(name)과 확장자(ext) 형태로 복사합니다.
						},
					},
				],
			},
		],
	},

	// .src/index.html파일을 dist 경로에 index.html 파일을 생성합니다.
	// Webpack이 만든 번들 파일을 HTML에 추가하여 생성합니다.
	plugins: [
		new HtmlWebpackPlugin({
			template: './public/index.html',
			filename: 'index.html',
		}),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: 'public/mockServiceWorker.js',
					to: 'mockServiceWorker.js',
				},
			],
		}),
		new ForkTsCheckerWebpackPlugin(),
		new DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
		}),
		new EnvironmentPlugin(['NODE_ENV']),
	],
	devtool: 'inline-source-map',
	devServer: {
		static: {
			directory: path.resolve(__dirname, 'public'),
		},
		hot: true,
		open: true,
		historyApiFallback: true,
	},
};
