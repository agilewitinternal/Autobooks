import React from 'react';

import PropTypes from 'prop-types';
import {Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button} from '@material-ui/core';
import {withStyles, makeStyles} from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TimerIcon from '@material-ui/icons/Timer';
import HistoryIcon from '@material-ui/icons/History';
import Typography from "@material-ui/core/Typography";
import Box from '@material-ui/core/Box';
import TextField from "@material-ui/core/TextField";
import moment from 'moment';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        maxWidth: 1000,
        marginTop: '2rem'
    },
    textInputAlign: {
        marginBottom: '2rem'
    },
    table: {
        minWidth: 700,
    }
});
const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
}))(TableRow);

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function IconLabelTabs() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const [TextFieldValue, setTextFieldValue] = React.useState('')
    const [enableActivity, setEnableActivity] = React.useState(true);
    const [showTableHeader, setTableHeader] = React.useState(false);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const activityName = (event) => {
        if (event.target.value) {
            setTextFieldValue(event.target.value)
            setEnableActivity(false);
        } else {
            setTextFieldValue(event.target.value)
            setEnableActivity(true);

        }
    }

    const activityStop = e => {
        let fetchRecord = JSON.parse(sessionStorage.getItem('ActivityRecords'))
        fetchRecord.map(record => {
            if (record.activityId == e.currentTarget.value) {
                let localClockIn = record.startTime;
                let clockOutStamp = moment().format("DD/MM/YYYY HH:mm:ss");
                record.endTime = clockOutStamp;
                record.duration = moment.utc(moment(clockOutStamp, "DD/MM/YYYY HH:mm:ss").diff(moment(localClockIn, "DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss");
                sessionStorage.setItem('ActivityRecords', JSON.stringify(fetchRecord))

            }
        })
    }

    const fetchAllActivities = JSON.parse(sessionStorage.getItem('ActivityRecords')) && JSON.parse(sessionStorage.getItem('ActivityRecords')).length > 0 && JSON.parse(sessionStorage.getItem('ActivityRecords')).map((activityRecord, index) => (
        <StyledTableRow>
            <StyledTableCell component="th" scope="row">
                {activityRecord.startTime}
            </StyledTableCell>
            <StyledTableCell align="left">{activityRecord.endTime}</StyledTableCell>
            <StyledTableCell align="left">{activityRecord.duration}</StyledTableCell>
            <StyledTableCell align="right">{activityRecord.description}</StyledTableCell>
        </StyledTableRow>

    ))
    const fetchCurrentActivities = JSON.parse(sessionStorage.getItem('ActivityRecords')) && JSON.parse(sessionStorage.getItem('ActivityRecords')).length > 0 && JSON.parse(sessionStorage.getItem('ActivityRecords')).map((activityRecord, index) => {
        return activityRecord.endTime == "" ? <StyledTableRow>
            <StyledTableCell component="th" scope="row">
                {activityRecord.startTime}
            </StyledTableCell>
            <StyledTableCell align="left">{activityRecord.endTime}</StyledTableCell>
            <StyledTableCell align="left">{activityRecord.duration}</StyledTableCell>
            <StyledTableCell align="right">{activityRecord.description}</StyledTableCell>
            <StyledTableCell align="right"><Button value={activityRecord.activityId}
                                                   variant="contained"
                                                   color="secondary"
                                                   onClick={activityStop}>Stop</Button></StyledTableCell>
        </StyledTableRow> : <div></div>
    })
    const addActivity = (event) => {
        let activityArray = [];
        let activityData = {}
        if (typeof Storage !== "undefined") {
            activityData['description'] = TextFieldValue;
            activityData['activityId'] = Math.floor(Math.random() * 100000),
                activityData['startTime'] = moment().format("DD/MM/YYYY [Time: ] HH:mm:ss")
            activityData['endTime'] = ''
            activityData['duration'] = ''
            activityArray.push(activityData)

            if (sessionStorage.getItem('ActivityRecords')) {
                let record = JSON.parse(sessionStorage.getItem('ActivityRecords'))
                record.push(activityData)
                sessionStorage.setItem('ActivityRecords', JSON.stringify(record))

            } else {
                sessionStorage.setItem('ActivityRecords', JSON.stringify(activityArray))
            }

            setTextFieldValue('');
            setEnableActivity(true);
        } else {
            console.log("Error in Adding Activity")
        }
    }

    return (
        <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
        >
            <Paper square className={classes.root}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="fullWidth"
                    indicatorColor="secondary"
                    textColor="secondary"
                    aria-label="icon label tabs example"
                >
                    <Tab icon={<TimerIcon/>} label="CLOCK IN / CLOCK OUT" {...a11yProps(0)}/>
                    <Tab icon={<HistoryIcon/>} label="ACTIVITY HISTORY" {...a11yProps(1)} />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <form className={classes.root} noValidate autoComplete="off">
                        <TextField value={TextFieldValue} className={classes.textInputAlign} id="standard-basic"
                                   label="Activity Name"
                                   size='medium' onChange={activityName}/>
                    </form>
                    <Button className={classes.textInputAlign} id="add-activity" variant="contained" color="primary"
                            disabled={enableActivity} onClick={addActivity}>
                        Start an activity
                    </Button>

                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="left">Start Time</StyledTableCell>
                                        <StyledTableCell align="left">End Time</StyledTableCell>
                                        <StyledTableCell align="left">Duration</StyledTableCell>
                                        <StyledTableCell align="right">Description</StyledTableCell>
                                        <StyledTableCell align="right">Activity Stop</StyledTableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {fetchCurrentActivities}
                                </TableBody>
                            </Table>
                        </TableContainer>

                </TabPanel>
                <TabPanel value={value} index={1}>
                    {
                        sessionStorage.getItem('ActivityRecords') && JSON.parse(sessionStorage.getItem('ActivityRecords')).length > 0 &&

                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="left">Start Time</StyledTableCell>
                                        <StyledTableCell align="left">End Time</StyledTableCell>
                                        <StyledTableCell align="left">Duration</StyledTableCell>
                                        <StyledTableCell align="right">Description</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {fetchAllActivities}

                                </TableBody>
                            </Table>
                        </TableContainer>
                    }
                </TabPanel>
            </Paper>
        </Grid>
    );
}