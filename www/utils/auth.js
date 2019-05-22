// www/utils/auth.js

import Router from 'next/router'
import nextCookie from 'next-cookies'

import cookie from "js-cookie"



export const auth = ctx => {
	const { token } = nextCookie(ctx)

	if (ctx.req && !token) {
		ctx.res.writeHead(302, { Location: '/login' })
		ctx.res.end()
		return
	}

	if (!token) {
		Router.push('./login')
	}

	return token
}

/* //VERSION 1
const getDisplayName = Component =>
	Component.displayName || Component.name || 'Component'

export const withAuthSync = WrappedComponent =>
	class extends Component {
		static displayName = `withAuthSync(${getDisplayName(WrappedComponent)})`

		static async getInitialProps (ctx) {
			const token = auth(ctx)

			const componentProps = 
				WrappedComponent.getInitialProps && 
				(await WrappedComponent.getInitialProps(ctx))

			return { ...componentProps, token }

		} // status async

		render() {
			return <WrappedComponent {...this.props} />
		}
	}
*/

//Gets the display name of a JSX component for dev tools
const getDisplayName = Component =>
	Component.display || Component.name || 'Component'

export const withAuthSync = WrappedComponent =>
	class extends Component {
		static displayName = `withAuthSync(${getDisplayName(WrappedComponent)})`

		static async getInitialProps (ctx) {
			const token = auth(ctx)

			const componentProps = 
				WrappedComponent.getInitialProps &&
				(await WrappedComponent.getInitialProps(ctx))

			return { ...componentProps, token }
		}

		//New: We bind our methods
		constructor (props) {
			super(props)

			this.syncLogout = this.syncLogout.bind(this)
		}

		//New: Add event listener when a restricted Page Component mounts
		componentDidMount () {
			window.addEventListener('storage', this.syncLogout)
		}

		//New: Remove event listener when the Components unmount
		//and delete all data
		componentWillUnmount() {
			window.removeEventListener('storage', this.syncLogout)]
			window.localStorage.removeItem('logout')
		} 

		// New: method to redirect the user when the event is called
		syncLogout(event) {
			if (event.key === 'logout') {
				console.log('Logged out from storage!')
				Router.push('/login')
			}

		render() {
			return <WrappedComponent {...this.props} />
		}
	}
}

export const logout = () =>
	cookie.remove("token")
	// To trigger the event listener we save some random data into the `logout` key
	window.localStorage.setItem("logout", Date.now()) //new
	Router.push("/login")
}

//Finally, because we added this functionality to our Authentication/Authorization
//HOC, we don't need to change anything in our Profile page.

//Now every time our user logs out, the session will be synchromized across
//all windows and tabs
