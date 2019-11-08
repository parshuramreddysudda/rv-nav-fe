  
import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import { addVehicle, updateVehicle } from "../../store/actions";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "./VehicleForm.css"

class VehicleForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      //these specifications are in their own object so that specifications can be sent direvtly to the BE
      //this is the object that will be sent to the BE
      specifications: {
        name: '',
      // height: 0, // value that gets sent to the backend, after combinining heightFeet and heightInches into one unit
       heightFeet: '', // value that stores the user entry of height in feet
       heightInches: '', // value that stores the user entry of height in inches
     //  width: 0, // these 3 width values follow the same structure as height
       widthFeet: '',
       widthInches: '',
    //   length: 0, // these 3 length values follow the same structure as height
       lengthFeet: '', 
       lengthInches: '',
       weight: '',  //this will be sent in pounds? check BE docs
       axel_count: '', //integer, unit implied
       class_name: '', //controlled input of one letter
       //created_at: '', //check BE for format, generate date with js
       dual_tires: false, //Bool, checkbox
       trailer: false,  //Bool, checkbox
      }
    }
  }
  
  componentDidMount(){
    //checks if we are coming from the vehicles tab and therefore if we are editing
    if(this.props.editing){
      //assigns prefill values of previous entry for the form if we are editing
      this.setState({
        specifications: {
          name: this.props.currentVehicle.name,
          heightFeet: Math.floor(this.props.currentVehicle.height),
          heightInches: Math.round((this.props.currentVehicle.height % 1) * 12),
          widthFeet: Math.floor(this.props.currentVehicle.width),
          widthInches: Math.round((this.props.currentVehicle.width % 1) * 12),
          lengthFeet: Math.floor(this.props.currentVehicle.length),
          lengthInches: Math.round((this.props.currentVehicle.length % 1) * 12),
          weight: this.props.currentVehicle.weight,
          vehicle_class: this.props.currentVehicle.vehicle_class,
          axel_count: this.props.currentVehicle.axel_count,         
          dual_tires: this.props.currentVehicle.dual_tires          
        } 
      })
    }
  }

  //handles input of numbers and converts into the right data type of int
  handleChange = (event) => {
    this.setState({
        specifications: {
          ...this.state.specifications,
          [event.target.name]: parseInt(event.target.value)         
        }
    })
  }

  //handles text only input
  handleText = (event) => {
    this.setState({
        specifications: {
          ...this.state.specifications,
          [event.target.name]: event.target.value      
        }
    })
  }

  //assigns state to a value based on whether a box is checked
  handleCheck = (event) => {
    //const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({
     specifications: {
      ...this.state.specifications,       
      [event.target.name]: event.target.checked
     }
    }) 
  }

  //assigns state to a value based on which radio button has been clicked
  handleRadio = (event) => {
    //const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({
     specifications: {
      ...this.state.specifications,       
      class_name: event.target.value
     }
    }) 
  }

  closeVehicleForm = () => this.props.setState({ 
    vehicleForm: "off",
    routing: "on",
    vehicles: "off",
    directions: "off" 
})

  //occurs when the submit button is clicked
  //converts inputs from user to correct values to send to the backend, then send them
  vehicleSubmit = (event) => {

    let overlayContent = document.getElementById('overlayNav')
        overlayContent.style.margin = '25px'
        overlayContent.style.height = '370px'

    let on = document.getElementsByClassName('on')[0]
      on.style.height = '300px'
    
    event.preventDefault();
    //Google analytics tracking
    window.gtag("event", "create vehicle", {
      event_category: "submit",
      event_label: "create vehicle"
    });
    
    let height = this.combineDistanceUnits(this.state.specifications.heightInches, this.state.specifications.heightFeet);
    let width = this.combineDistanceUnits(this.state.specifications.widthInches, this.state.specifications.widthFeet);
    let length = this.combineDistanceUnits(this.state.specifications.lengthInches, this.state.specifications.lengthFeet);
    let weight =  this.state.specifications.weight;
    let axel_count = this.state.specifications.axel_count;
    let vehicle_class = this.state.specifications.class_name;
    let trailer = this.state.specifications.trailer;
    if(vehicle_class === "Trailer"){
      vehicle_class = "";
      trailer = true;
    }
    if(weight === ""){
      weight = 0;
    } 
    if(axel_count === ""){
      axel_count = 0;
    } 
    //make sure all values entered are sent as the correct data type to the back end
    parseFloat(height);
    parseFloat(length);
    parseFloat(width);
    parseFloat(weight);
    parseInt(axel_count);
    
    //send is the object that is sent to the web backend to be stored
    //it is made using values from the form, some of which are processed and converted before being assigned to the keys here
    let send = {
      name: this.state.specifications.name,
      height: height,
      width: width,
      length: length,
      weight: weight,
      axel_count: axel_count,
      vehicle_class: vehicle_class,
      trailer: trailer,
      dual_tires: this.state.specifications.dual_tires
    }
    console.log("sent", send);
    console.log("id", this.props.id);
    if(this.props.editing){
      this.props.updateVehicle(send, this.props.id);
      this.props.editVehicleToggle(this.props.id);
    } else {
      this.props.addVehicle(send);
      this.closeVehicleForm();
    }
    this.setState({
      specifications: {
        name: '',
        heightFeet: '',
        heightInches: '',
        widthFeet: '',
        widthInches: '',
        lengthFeet: '',
        lengthInches: '',
        weight: '',
        axel_count: '',
        class_name: '',
        dual_tires: false,
        trailer: false,
      }
    })
  }


  //combines feet and inch units into feet only, to be sent to the backend
  combineDistanceUnits = (inchesIn, feetIn) => {
    let inches = inchesIn;
    let feet = feetIn;
    if(feet === ""){
      feet = 0;
    } if (inches === ""){
      inches = 0;
    }
    const inchesCombined = feet + (inches / 12);
    return inchesCombined;
  }

  render(){
    console.log("VEHICLE FORM PROPS", this.props)
    console.log("VEHICLE FORM STATE", this.props.state)
    return(
      <div className='WidgetWrapper'> 
        <div className='vehicle-form-wrap'>
        <div className="vehicle-form" onSubmit={this.vehicleSubmit}>
          {/* <h2>RV WAY</h2> */}
          <div className='FormContainer'>
          <div className="back">
                        <p className={`backButton ${this.state.specifications.routing === `on` ? `selected` : `sidebar-tab`} `}
                                   id="routing"
                                   onClick={this.props.selectVehicles}>Back
                        </p>
                        <p className="back-label">| Add Vehicle</p>
                  </div>
          <div className="form-wrapper">        
            <h3 id='vehicleAddTitle'>Add a Vehicle</h3>
            <p className="vehicle-spec">Name (required)</p>
            <div className='measurements'>
              <input  className="start-input-div"      
                type="string"
                required
                name='name'
                placeholder="The Mystery Machine"
                value={this.state.specifications.name}
                onChange={this.handleText}
                id="rv-name"
              >
              </input>
          </div>
          
           
              <div className="vehicle-spec-label">
              <p className="vehicle-spec">Height</p>
              <p className="vehicle-spec">Width</p>
              </div>
              <div className='measurementsParent'>
              <div className='inputsFieldsContainer'>
              <div className="form-section">  
                <div className='measurements'>
                  <p className='measurementsInput'>Feet</p>
                  <input        
                    type="number"
                    min="0"
                    max="100"
                    name='heightFeet'
                    placeholder="0"
                    value={this.state.specifications.heightFeet}
                    onChange={this.handleChange}
                    id="input-boxes"
                  >
                  </input>
                </div>
                <p className="plus">+</p>
                <div className="measurements">
                  <p className='measurementsInput'>Inches</p>
                  <input        
                    type="number"
                    min="0"
                    max="11"
                    name='heightInches'
                    placeholder="0"
                    // this.state.specifications.heighInches === 0 ? undefined :
                    value={ this.state.specifications.heightInches}
                    onChange={this.handleChange}
                    id="input-boxes"
                  >
                </input>
                </div>
              </div>
            </div>
            <div className='inputsFieldsContainer'>
             
              <div className="form-section">
              <div className="measurements">
                <p className='measurementsInput '>Feet</p>
                <input        
                  type="number"
                  min="0"
                  max="100"
                  name='widthFeet'
                  placeholder="0"
                  value={this.state.specifications.widthFeet}
                  onChange={this.handleChange}
                  id="input-boxes"
                >
              </input>
              </div>
              <p className="plus">+</p>
              <div className="measurements">
              <p className='measurementsInput'>Inches</p>
                <input        
                  type="number"
                  min="0"
                  max="11"
                  name='widthInches'
                  placeholder="0"
                  value={this.state.specifications.widthInches}
                  onChange={this.handleChange}
                  id="input-boxes"
                >
              </input>
              </div>
              </div>
            </div>
          </div>

          <div className="vehicle-spec-label">
              <p className="vehicle-spec">Length</p>
              <p className="vehicle-spec">Weight</p>
              </div>
              <div className='measurementsParent'>
              <div className='inputsFieldsContainer'>
              <div className="form-section">  
                <div className='measurements'>
                  <p className='measurementsInput'>Feet</p>
                  <input        
                    type="number"
                    min="0"
                    max="100"
                    name='lengthFeet'
                    placeholder="0"
                    value={this.state.specifications.lengthFeet}
                    onChange={this.handleChange}
                    id="input-boxes"
                  >
                  </input>
                </div>
                <p className="plus">+</p>
                <div className="measurements">
                  <p className='measurementsInput'>Inches</p>
                  <input        
                    type="number"
                    min="0"
                    max="11"
                    name='lengthInches'
                    placeholder="0"
                    // this.state.specifications.heighInches === 0 ? undefined :
                    value={ this.state.specifications.lengthInches}
                    onChange={this.handleChange}
                    id="input-boxes"
                  >
                </input>
                </div>
              </div>
            </div>
            <div className='inputsFieldsContainer'>
             
              <div className="form-section">
              <div className="measurements">
                <p className='measurementsInput'>Pounds</p>
                <input className="pounds"       
                  type="number"
                  min="0"
                  max="100"
                  name='weightPounds'
                  placeholder="0"
                  value={this.state.specifications.weightPounds}
                  onChange={this.handleChange}
                  id="input-boxes"
                >
              </input>
              </div>
              
              </div>
            </div>
          </div>
         
          <div className='inputsFieldsContainer'>
          <div className='measurementsParent'>
              <div className="form-section">
              <div className="measurements">
                <p className='measurementsInput'>Axel Count</p>
                <input className="axels"       
                  type="number"
                  min="0"
                  max="100"
                  name='axel_count'
                  placeholder="0"
                  value={this.state.specifications.axel_count}
                  onChange={this.handleChange}
                  id="input-boxes"
                >
              </input>
              </div>
               
             


            <div className="tires-check">
             <div className="tires-check-p">
            <p >Tires</p>
           <div className="tires-check-p2">
          <Form.Check 
          name="dual_tires" 
          type="checkbox"
          checked={this.state.specifications.dual_tires}
          onChange={this.handleCheck}
          id={`inline-text-2`} 
          />
          <p>I have a dual wheel vehicle</p>  
           </div> 
         </div>
          </div>

           </div> 
            </div> 
            </div>
             <p className="vehicle-spec">RV TYPE</p> 
          <div className="class-radios">
          <div className='row1'>
            <div className="rv-radio">  
          <Form.Check className="form-check"name="class"inline label="Class A" type="radio" id={`inline-text-2`} 
              value="CLASS A"
              checked={this.state.specifications.class_name === "A"} onChange={this.handleRadio}
               />
          </div>
          <div className="rv-radio">
          <Form.Check className="form-check" name="class" inline label="Class B" type="radio" id={`inline-text-2`} 
          value="CLASS B"
          checked={this.state.specifications.class_name === "B"} onChange={this.handleRadio}
          />
          </div>
           <div className="rv-radio">
          <Form.Check className="form-check"name="class" inline label="Class C" type="radio" id={`inline-text-2`} 
          value="CLASS C"
          checked={this.state.specifications.class_name === "C"} onChange={this.handleRadio}
          />
          </div>
          </div>
          <div className='row2'>
           <div className="rv-radio">
           <Form.Check className="form-check" name="class" inline label="5TH Wheel" type="radio" id={`inline-text-2`} 
          value="5TH WHEEL"
          checked={this.state.specifications.class_name === "5TH WHEEL"} onChange={this.handleRadio}
          />
          </div>
           <div className="rv-radio">
           <Form.Check className="form-check" name="class" inline label="Tagalong" type="radio" id={`inline-text-2`} 
          value="TAGALONG CAMPER"
          checked={this.state.specifications.class_name === "TAGALONG CAMPER"} onChange={this.handleRadio}
          /> 
          </div>
         
          
   
         
          </div>
          </div> 
         
         
         
      <div className="buttons">
          <button className="btn-submit button1"   onClick={this.props.selectVehicles}>Cancel</button>
          <Button className="btn-submit " type="submit"  onClick={this.vehicleSubmit}>Add</Button>

      </div>
         
          </div>
          </div>
        </div>
        </div>
      </div>
    )
  }

}

const mapStateToProps = state => ({})

export default withRouter(connect(
  mapStateToProps, { addVehicle, updateVehicle }
)(VehicleForm))