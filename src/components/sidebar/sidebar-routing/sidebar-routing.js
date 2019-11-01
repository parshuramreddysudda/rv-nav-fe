import React, { useState } from 'react'; 
import './sidebar-routing.scss'
import RoutingForm from '../../map/routingForm'
import SidebarMenu from '../SidebarMenu.js'

const RoutingSidebar = (props) => {

    const [state, setState] = useState({
        routingForm: "off"
    })

    console.log('RoutingSidebar', props)
    console.log('RoutingSidebar', state.routingForm)

    const sidebarAnchor = () => {
        let sidebar = document.getElementById('overlayNav')
        sidebar.style.height = '100%'
        sidebar.style.margin = '0'
        sidebar.style.width = '375px'
        document.getElementsByClassName('navbar')[0].style.display = 'none'
        document.getElementsByClassName('overlay-content')[0].style.margin = 0
    }
    const revertChanges = () => {
        let sidebar = document.getElementById('overlayNav')
        sidebar.style.height = '370px !important'
        sidebar.style.margin = '25px'
        sidebar.style.width = '375px'
        document.getElementsByClassName('navbar')[0].style.display = 'block'
        document.getElementsByClassName('overlay-content')[0].style.marginTop = '25px'
    }

    return (
        <>
            {props.loading !== 'routing successful' ? <p className="route-loading">{props.loading}</p> :
                state.routingForm === 'off' ? 
                    <div className='sidebarContainer'>
                        {/* <div className='sidebarHeader'>
                            <h2>RV WAY</h2>
                        </div> */}
                        <SidebarMenu />
                        {/* <div className='directionsContainer'> */}
                            <div className='backbuttonContainer'>
                                <h6 
                                className='routingBackButton'
                                onClick={props.checkState}
                                >Back</h6>
                            </div>
                            <div className='startEndContainer'>
                                <h3 id='estimatedTime'>17 mins (4 miles)</h3>
                                <div id='startPointContainer'>
                                    <p className='startAndEnd'>STARTING POINT</p>
                                    <p>{props.start}</p>
                                </div>
                                <div id='destinationPointContainer'>
                                    <p className='startAndEnd'>DESTINATION</p>
                                    <p>{props.end}</p>
                                </div>
                            </div>
                            {/* <div className='sidebarOptions'>
                                <p>This route avoids</p>
                            </div> */}
                            <div className="directions">
                            <h3 id='directionsTitle'>Directions</h3>
                                {props.textDirections.map((e, i) => {
                                    return (
                                        <p key={i} className="instruction">{e}</p>
                                        )
                                    })}
                                {sidebarAnchor()}
                            </div>
                        {/* </div> */}
                        <div className='sidebarFooterContainer'>
                            <p id='sidebarFooter'>These directions are for planning purposes only. You may find that construction projects, traffic, weather, or other events may cause conditions to differ from the map results, and you should plan your route accordingly. You must obey all signs or notices regarding your route.</p>
                        </div>
                    </div>
                : state.routingForm = 'on'
            }
        </>
    )
};

export default RoutingSidebar;