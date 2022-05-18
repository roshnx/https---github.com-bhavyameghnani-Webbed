import "./Dashboard.css";
import React from "react";
import axios from "axios";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import { Chip } from "@material-ui/core";
// import { Stack } from "@mui/material";
// import SearchIcon from '@material-ui/icons/Search';
// import InputBase from '@material-ui/core/InputBase';
import { useState, useEffect } from "react";
// import { DateRangePicker } from '@mui/lab';
// import { DatePicker } from "@material-ui/pickers";
// import { TextField } from "@material-ui/core";
import SocialCard from "./SocialCard";
import {
    createStyles,
    makeStyles,
  } from '@material-ui/core/styles';

import {
    RangeDatePicker,
    SingleDatePicker
  } from "react-google-flight-datepicker";
import "react-google-flight-datepicker/dist/main.css";

const useStyles = makeStyles((theme) => 
    createStyles({
        // search: {
        //   position: 'relative',
        //   borderRadius: theme.shape.borderRadius,
        //   backgroundColor: fade(theme.palette.common.white, 0.15),
        //   '&:hover': {
        //     backgroundColor: fade(theme.palette.common.white, 0.25),
        //   },
        //   marginLeft: 0,
        //   width: '100%',
        //   [theme.breakpoints.up('sm')]: {
        //     marginLeft: theme.spacing(1),
        //     width: 'auto',
        //   },
        // },
        yellowPaper: {
            backgroundColor: "#EEF7FA"
        },
        searchIcon: {
          padding: theme.spacing(0, 2),
          height: '100%',
          position: 'absolute',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        inputRoot: {
          color: 'inherit',
        },
        // container: {
        //     display : "flex",
        //     justify-content : "space-between"
        // }
        inputInput: {
          padding: theme.spacing(1, 1, 1, 0),
          // vertical padding + font size from searchIcon
          paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
          transition: theme.transitions.create('width'),
          width: '100%',
          [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
              width: '20ch',
            },
          },
        },
    }
));

function Dashboard(){
    var axios = require("axios").default;

    var options = {
      method: 'GET',
      url: 'https://api.newscatcherapi.com/v2/search',
      params: {q: 'Bitcoin', lang: 'en', sort_by: 'relevancy', page: '1'},
      headers: {
        'x-api-key': 'PhN53r0LSx8TUa13SsfHIHzznRMWW82ClIHZ9v7X9FA'
      }
    };
    
    
    const classes = useStyles();
    const [allUsers, setAllUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [value, setValue] = useState([null, null])
    const [inputText, setInputText] = useState("");
    const [list,setList] = useState([]);
    const handleDelete = (chipToDelete: String) => {
      setList(list => list.filter(list => list !== chipToDelete))
    }
    let search = list.join(' ');
    console.log(search)
    
    console.log(list)
    const handleSubmit=(e)=>{
      e.preventDefault();
      // console.log("refresh prevented");
      console.log(inputText);
      setList((oldList) => [...oldList,inputText])
      setInputText("")
    }
    // const handleDelete = () => {
    //   console.info('You clicked the delete icon.');
    // };
    useEffect(() => {
      (async () => {
        let userData;
        // try {
        //   const response = await fetch(`https://gnews.io/api/v4/search?q=${search}&token=b203feb1aa8a7928cb589dbdf5122689`);
        //   userData = await response.json();
        // } catch (error) {
        //   console.log(error);
        //   userData = [];
        // }
        axios.request(options).then(function (response) {
          console.log(response.data);
        }).catch(function (error) {
          console.error(error);
        });
        console.log(userData);
        setAllUsers(userData);
        setUsers(userData);
      })();
    },[]);
    console.log(users);
    return (
        <React.Fragment>
            {/* <MuiThemeProvider theme={eyTheme}> */}
            <CssBaseline />
            <AppBar color="default" position="relative">
            <Toolbar>
                {/* <img src={banner} alt="Banner" width="40" height="50" /> */}
                <Typography variant="h6" color="inherit" noWrap>
                Webbed - Dashboard
                </Typography>
            </Toolbar>
            </AppBar>
            <Box p={5} sx={{
                display : "flex",
                justifycontent :  "space-between",
                flexDirection: 'row',
                flexWrap: 'wrap'
            }}>
                <Paper className={classes.yellowPaper}>
                    <Box p={5} >
                        <div className={classes.search}>
                          <form onSubmit={handleSubmit}>
                              <input
                                  placeholder="Search..."
                                  classes={{
                                  root: classes.inputRoot,
                                  input: classes.inputInput,
                                  }}
                                  value={inputText}
                                  onChange={(e) => setInputText(e.target.value)}
                                  // inputProps={{ 'aria-label': 'search ' }}
                              />
                              <button>Add</button>
                          </form>
                        </div>
                        <div>
                            <RangeDatePicker
                                startDate={new Date(2022, 4, 15)}
                                endDate={new Date(2022, 5, 8)}
                                minDate={new Date(2022, 4, 1)}
                                maxDate={new Date(2022, 5, 5)}
                            />
                        </div>
                        {
                          list.map(chip =><div>
                              <Chip label={chip} key={chip} onDelete={() => handleDelete(chip)} />
                          </div>)
                        }
                    </Box>
                </Paper>
            </Box>
            <div className="App">
              <h1>Social Cards</h1>
              {/* <input className="search-box" onInput={filterCards} placeholder="Search..."/> */}
              <div className="cards-container">

              {/* {users.map((user, index) => (
                <SocialCard key={index} userData={user} />
                ))} */}
              </div>
            </div>
        </React.Fragment>
    )
}

export default Dashboard;