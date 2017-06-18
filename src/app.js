// ----------------------
// IMPORTS

/* NPM */

// React
import React from 'react';
import PropTypes from 'prop-types';

// GraphQL
import { graphql } from 'react-apollo';

// Routing
import { Link, Route, Switch } from 'react-router-dom';

// <Helmet> component for setting the page title
import Helmet from 'react-helmet';

/* Local */

// NotFound 404 handler for unknown routes
import { NotFound, Redirect } from 'kit/lib/routing';

// GraphQL queries
import allUsers from 'src/queries/allUsers.gql';

// GraphQL mutations
import createUser from 'src/mutations/createUser.gql';

// Styles
import './styles.global.css';
import css from './styles.css';
import sass from './styles.scss';
import less from './styles.less';

// Get the ReactQL logo.  This is a local .svg file, which will be made
// available as a string relative to [root]/dist/assets/img/
import logo from './reactql-logo.svg';

// ----------------------

// We'll display this <Home> component when we're on the / route
const Home = () => <h1>You're on the home page - click another link above</h1>;

// Helper component that will be conditionally shown when the route matches.
// This gives you an idea how React Router v4 works
const Page = ({ match }) => <h1>Changed route: {match.params.name}</h1>;

// Create a route that will be displayed when the code isn't found
const WhenNotFound = () => (
  <NotFound>
    <h1>Unknown route - the 404 handler was triggered!</h1>
  </NotFound>
);

// Specify PropTypes if the `match` object, which is injected to props by
// the <Route> component
Page.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.object,
  }).isRequired,
};

// Stats pulled from the environment.  This demonstrates how data will
// change depending where we're running the code (environment vars, etc)
// and also how we can connect a 'vanilla' React component to an RxJS
// observable source, and feed eventual values in as properties
const Stats = () => {
  const info = [['Environment', process.env.NODE_ENV]];

  return (
    <ul className={css.data}>
      {info.map(([key, val]) => <li key={key}>{key}: <span>{val}</span></li>)}
    </ul>
  );
};

// Now, let's create a GraphQL-enabled component...

// ... then, let's create the component and decorate it with the `graphql`
// HOC that will automatically populate `this.props` with the query data
// once the GraphQL API request has been completed
/*
{
  data: {
    allUsers: {
      username: "admin"
    }
  }
}
*/
@graphql(allUsers)
class GraphQLMessage extends React.PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      allUsers: PropTypes.arrayOf(
        PropTypes.shape({
          username: PropTypes.string.isRequired,
        }),
      ),
    }),
  };

  render() {
    const { data } = this.props;
    const users = data.allUsers || [];
    const isLoading = data.loading ? 'yes' : 'nope';
    return (
      <div>
        <h2>
          Message from GraphQL server: My username is
          {users.map(u => <em key={u.id}> {u.username},</em>)}
        </h2>
        <h2>Currently loading?: {isLoading}</h2>
      </div>
    );
  }
}

@graphql(createUser)
class CreateUser extends React.Component {
  state = {
    username: '',
  };

  render() {
    return (
      <div>
        <input
          value={this.username}
          onChange={e => this.setState({ username: e.target.value })} />
        <button
          onClick={() =>
            this.props.mutate({
              variables: {
                username: this.state.username,
              },
            })}>
          Create a user
        </button>
      </div>
    );
  }
}

// Example of CSS, SASS and LESS styles being used together
const Styles = () => (
  <ul className={css.styleExamples}>
    <li className={css.example}>Styled by CSS</li>
    <li className={sass.example}>Styled by SASS</li>
    <li className={less.example}>Styled by LESS</li>
  </ul>
);

// Export a simple component that allows clicking on list items to change
// the route, along with a <Route> 'listener' that will conditionally display
// the <Page> component based on the route name
export default () => (
  <div>
    <Helmet
      title="ReactQL application"
      meta={[
        {
          name: 'description',
          content: 'ReactQL starter kit app',
        },
      ]} />
    <div className={css.hello}>
      <img src={logo} alt="ReactQL" className={css.logo} />
    </div>
    <hr />
    <GraphQLMessage />
    <hr />
    <CreateUser />
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/page/about">About</Link></li>
      <li><Link to="/page/contact">Contact</Link></li>
      <li><Link to="/old/path">Redirect from /old/path → /new/path</Link></li>
    </ul>
    <hr />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/page/:name" component={Page} />
      <Redirect from="/old/path" to="/new/path" />
      <Route component={WhenNotFound} />
    </Switch>
    <hr />
    <p>Runtime info:</p>
    <Stats />
    <hr />
    <p>Stylesheet examples:</p>
    <Styles />
  </div>
);
