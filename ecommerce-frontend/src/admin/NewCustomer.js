import React, {useState, useEffect} from "react";
import {Link, Redirect} from "react-router-dom";
import Layout from "../core/Layout";
import {signup,isAuthenticated } from "../auth";
import {getSalesusers} from "../salesadmin/apiSalesAdmin";
import {createAddress} from "./apiAdmin";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const NewCustomer = () => {
    const [prifletab, setPrifletab] = useState(true);
    const [addressestab, setAddressestab] = useState(false);

    const {user, token} = isAuthenticated();
    const [values, setValues] = useState({
        name: "",
        email: "",
        password: "",
        role:"",
        mobile:"",
        packagedays:"",
        packagestartedfrom:new Date(),
        targetcalory:"",
        about:"",
        salehandleby:"",
        salehandlers:[],
        holdortrialdays:"",
        holdortrialstartdate:"",
        holdortrialenddate:"",
        diagnosis:"",
        specialconsideration:"",
        typeofprogram:"",
        status:"",
        lastupdateduser:"",
        redirectToProfile: false,
        error: "",
        success: false
    });

    const { name, email, password,role,mobile, packagedays, packagestartedfrom,
        targetcalory, about,salehandleby, salehandlers,holdortrialdays,holdortrialstartdate,
        holdortrialenddate,
        diagnosis, specialconsideration, typeofprogram,status,lastupdateduser,
         redirectToProfile,
        success, error } = values;

    // Below code for user address create
    const [address, setAddress] = useState({
        userid:"",
        contactperson:"",
        contact:"",
        street1:"",
        street2:"",
        citi:"",
        state:"",
        country:"",
        zipcode:"",
        addresstype:"",
        addressdefault:"",
        formData: new FormData()
    });

    const { userid, contactperson, contact, street1,street2,citi, state, country,
        zipcode, addresstype,addressdefault, formData} = address;

    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value });
    };

    const handleAddressChange = name => event => {
        formData.set(name, event.target.value );
        setAddress({ ...address, error: false, [name]: event.target.value });
    };
    
    const clickSubmit = event => {
        event.preventDefault();
        setValues({ ...values, error: false });
        signup({ name, email, password,role,mobile,packagedays,packagestartedfrom,
        targetcalory, about,salehandleby, salehandlers,holdortrialdays,holdortrialstartdate,
        holdortrialenddate, diagnosis, specialconsideration,typeofprogram,
        status,lastupdateduser, redirectToProfile}).
        then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error, success: false });
            } else {
                // after successfully user created try to create user address
                if(data.user._id){
                    formData.set('userid', data.user._id );
                    createAddress(data.user._id, token, formData).then(data => {
                        setAddress({ 
                            ...address,
                            userid:"",
                            contactperson:"",
                            contact:"",
                            street1:"",
                            street2:"",
                            citi:"",
                            state:"",
                            country:"",
                            zipcode:"",
                            addresstype:"",
                            addressdefault:"",
                            formData:""
                        });
                    }); 
                }

                // create address success

                setValues({
                    ...values,
                    name: "",
                    email: "",
                    password: "",
                    role:"",
                    mobile:"",
                    packagedays:"",
                    packagestartedfrom:"",
                    targetcalory:"",
                    about:"",
                    salehandleby:"",
                    salehandlers:[],
                    holdortrialdays:"",
                    holdortrialstartdate:"",
                    holdortrialenddate:"",
                    diagnosis:"",
                    specialconsideration:"",
                    typeofprogram:"",
                    status:"",
                    lastupdateduser:"",
                    redirectToProfile: true,
                    success: true
                });
            }
        });
    };

    const redirectUser = () => {
        if (redirectToProfile) {
            if (!error) {
                return <Redirect to="/admin/customers" />;
            }
        }
    };

    // load sales users or person and set form data
    let roles ="6";
    const loadSalesUsers = () => { 
        getSalesusers(user._id, token, { roles }).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({
                    ...values,
                    salehandlers: data
                });
            }
        });
    };

    useEffect(() => {
        loadSalesUsers();
    }, []);

    const signUpForm = () => (
        <form>
            <div className="prifletab" style={{ display: (prifletab ? 'block' : 'none') }}>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input
                    onChange={handleChange("name")}
                    type="text"
                    className="form-control"
                    value={name}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Email</label>
                <input
                    onChange={handleChange("email")}
                    type="email"
                    className="form-control"
                    value={email}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Mobile</label>
                <input
                    onChange={handleChange("mobile")}
                    type="text"
                    className="form-control"
                    value={mobile}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Role</label>
                <select
                    onChange={handleChange("role")}
                    className="form-control"
                >
                    <option>Please select</option>
                    <option value="0">Customer</option>
                    <option value="4">Dietician</option>
                    <option value="5">Sales Admin</option>
                    <option value="6">Sales Person</option>
                    <option value="7">Accountant</option>
                </select>
            </div>

            <div className="form-group">
                <label className="text-muted">Password</label>
                <input
                    onChange={handleChange("password")}
                    type="password"
                    className="form-control"
                    value={password}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Package Days</label>
                <input
                    onChange={handleChange("packagedays")}
                    type="text"
                    className="form-control"
                    value={packagedays}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Package Start Date</label>
                {/*<DatePicker      
                    onChange={handleChange("packagestartedfrom")}
                  />*/}

                <input
                    onChange={handleChange("packagestartedfrom")}
                    type="date"
                    className="form-control"
                    value={packagestartedfrom}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Target Calory</label>
                <input
                    onChange={handleChange("targetcalory")}
                    type="text"
                    className="form-control"
                    value={targetcalory}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Customer Note</label>
                <textarea
                    onChange={handleChange("about")}
                    type="text"
                    className="form-control"
                    value={about}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Sales Person</label>
                <select
                    onChange={handleChange("salehandleby")}
                    className="form-control"
                >
                    <option>Please select</option>
                    {salehandlers &&
                        salehandlers.map((c, i) => (
                            <option key={i} value={c.name}>
                                {c.name}
                            </option>
                        ))}
                </select>
            </div>

             <div className="form-group">
                <label className="text-muted">Status</label>
                <select
                    onChange={handleChange("status")}
                    className="form-control"
                >
                    <option>Please select</option>
                    <option value="In-Active">In-Active</option>
                    <option value="Active">Active</option>
                    <option value="Hold">Hold</option>
                    <option value="Free-Trial">Free Trial</option>
                </select>
            </div>

            <div className="form-group">
                <label className="text-muted">Hold or Trial in Days</label>
                <input
                    onChange={handleChange("holdortrialdays")}
                    type="text"
                    className="form-control"
                    value={holdortrialdays}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Hold or Free Trial Start Date</label>
                <input
                    onChange={handleChange("holdortrialstartdate")}
                    type="date"
                    className="form-control"
                    value={holdortrialstartdate}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Hold or Free Trial End Date</label>
                <input
                    onChange={handleChange("holdortrialenddate")}
                    type="date"
                    className="form-control"
                    value={holdortrialenddate}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Diagnosis</label>
                <textarea
                    onChange={handleChange("diagnosis")}
                    type="text"
                    className="form-control"
                    value={diagnosis}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Special Consideration</label>
                <textarea
                    onChange={handleChange("specialconsideration")}
                    type="text"
                    className="form-control"
                    value={specialconsideration}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Type of Program</label>
                <textarea
                    onChange={handleChange("typeofprogram")}
                    type="text"
                    className="form-control"
                    value={typeofprogram}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Modified By</label>
                <input readOnly
                    onChange={handleChange("lastupdateduser")}
                    type="text"
                    className="form-control"
                    value={user.name}
                />
            </div>
            </div>

            <div className="addressestab" style={{ display: (addressestab ? 'block' : 'none') }} >
                
                <div className="form-group">
                <label className="text-muted">Address Type</label>
                <select
                    onChange={handleAddressChange("addresstype")}
                    className="form-control">
                    <option>Please select</option>
                    <option value="billingshipping">Both Billing & Shipping</option>
                    <option value="billing">Only Billing</option>
                    <option value="shipping">Only Shipping</option>
                </select>
                </div>

                <div className="form-group">
                <label className="text-muted">Default Address</label>
                <select
                    onChange={handleAddressChange("addressdefault")}
                    className="form-control">
                    <option>Please select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
                </div>

                <div className="form-group"  >
                <label className="text-muted">Name</label>
                <input
                    onChange={handleAddressChange("contactperson")}
                    type="text"
                    className="form-control" value={contactperson}
                />
                </div>

                <div className="form-group"  >
                <label className="text-muted">Mobile</label>
                <input
                    onChange={handleAddressChange("contact")}
                    type="text"
                    className="form-control" value={contact}
                />
                </div>

                <div className="form-group"  >
                <label className="text-muted">Street Address 1</label>
                <input
                    onChange={handleAddressChange("street1")}
                    type="text"
                    className="form-control" value={street1}
                />
                </div>

                <div className="form-group"  >
                <label className="text-muted">Street Address 2</label>
                <input
                    onChange={handleAddressChange("street2")}
                    type="text"
                    className="form-control" value={street2}
                />
                </div>

                <div className="form-group">
                <label className="text-muted">City</label>
                <select
                    onChange={handleAddressChange("city")}
                    className="form-control"
                >
                    <option>Please select</option>
                    <option value="gurugram">Gurugram</option>
                    <option value="delhi">Delhi</option>
                </select>
                </div>

                <div className="form-group">
                <label className="text-muted">State</label>
                <select
                    onChange={handleAddressChange("state")}
                    className="form-control"
                >
                    <option>Please select</option>
                    <option value="haryana">Haryana</option>
                    <option value="delhi">Delhi</option>
                </select>
                </div>

                <div className="form-group">
                <label className="text-muted">Country</label>
                <select
                    onChange={handleAddressChange("country")}
                    className="form-control"
                >
                    <option>Please select</option>
                    <option value="india">India</option>
                    <option value="others">Others</option>
                </select>
                </div>

                <div className="form-group"  >
                <label className="text-muted">Zip Code</label>
                <input
                    onChange={handleAddressChange("zipcode")}
                    type="text"
                    className="form-control" value={zipcode}
                />
                </div>
            </div>

            <button onClick={clickSubmit} className="btn btn-primary">
                Submit
            </button>
        </form>
    );

    const showError = () => (
        <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
        >
            {error}
        </div>
    );

    const showSuccess = () => (
        <div
            className="alert alert-info"
            style={{ display: success ? "" : "none" }}
        >
            New account is created. Please <Link to="/signin">Signin</Link>
        </div>
    );

    const goBack = () => (
        <div className="mt-3 mb-3 bradcrum">
            <Link  to="/admin/dashboard" className="text-warning">
                Dashboard >
            </Link><span>  &nbsp;  </span>
            <Link to="/admin/customers" className="text-warning">
                Manage Customer
            </Link>
        </div>
    );

    const ShowHideTabs = tabname => {
        if(tabname == 'addressestab'){
            setAddressestab(true);
            setPrifletab(false);
        }
        if(tabname == 'prifletab'){
            setAddressestab(false);
            setPrifletab(true);
        }
        
    }

    const profiletabs = () => {
        return (
            <div className="card">
                <h4 className="card-header">Create  User Tabs</h4>
                <ul className="list-group">
                    <li className={ (prifletab ? ' highlighttab list-group-item' : 'list-group-item') } onClick={ () => ShowHideTabs('prifletab') }>
                       <a className="nav-link" >
                            Profile
                        </a>
                    </li>
                    <li className={ (addressestab ? ' highlighttab list-group-item' : 'list-group-item') } onClick={ () => ShowHideTabs('addressestab') }>
                       <a className="nav-link" >
                            Address
                        </a>
                    </li>
                </ul>
            </div>
        );
    };

    return (
        <Layout
            title="Signup"
            description="Signup to Node React E-commerce App"
            className="container-fluid"
        >
            <div className="row">
                <div className="col-12">{goBack()} </div>
                <div className="col-2">{profiletabs()}</div>
                <div className="col-9">
                    {showSuccess()}
                    {showError()}
                    {signUpForm()}
                    {redirectUser()}
                </div>
            </div>
        </Layout>
    );
};

export default NewCustomer;
