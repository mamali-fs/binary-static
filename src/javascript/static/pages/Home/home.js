import HomeComponent from './home.jsx';

const React = require('react');
const ReactDOM = require('react-dom');

const initHomeComponent = () => {
    ReactDOM.render(
        <HomeComponent />,
        document.querySelector('#home')
    );
};

const Home = (() => {
    const onLoad = () => {
        initHomeComponent();

    };

    return {
        onLoad,
    };
})();

module.exports = Home;
