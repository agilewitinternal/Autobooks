import React, { Fragment } from 'react';
import Header from './components/Header';
import ClockPanel from './components/ClockPanel';

export default function App() {
    return(
        <Fragment>
            <Header/>
            <ClockPanel/>
        </Fragment>
    )
}
