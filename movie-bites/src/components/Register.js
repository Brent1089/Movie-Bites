import { useState } from 'react';
import { useAuth } from '../AuthContext';

/**
 * Renders the account registration form.
 */
export default function Register() {
	const { handleRegister } = useAuth();
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: ''
	});

	/**
	 * Updates the matching registration form field.
	 */
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	/**
	 * Submits registration details to AuthContext.
	 */
	const handleSubmit = (e) => {
		e.preventDefault();
		handleRegister(formData);
	};

	return (
		<div className="bg-rust text-rust-cream py-3 rounded-2 mt-3 mb-3 shadow-lg">
			<div className="container">
				<h4 className="mb-3">Register</h4>
				<form onSubmit={handleSubmit}>
					<div className="mb-3">
						<label htmlFor="username" className="form-label">Username</label>
						<input type="text" className="form-control" id="username"
							name="username" value={formData.username} onChange={handleInputChange}
							required />
					</div>
					<div className="mb-3">
						<label htmlFor="email" className="form-label">Email</label>
						<input type="email" className="form-control" id="email"
							name="email" value={formData.email} onChange={handleInputChange}
							required />
					</div>
					<div className="mb-3">
						<label htmlFor="password" className="form-label">Password</label>
						<input type="password" className="form-control" id="password"
							name="password" value={formData.password} onChange={handleInputChange}
							required />
					</div>
					<button type="submit" className="btn bg-rust btn-rust">
						Register
					</button>
				</form>
			</div>
		</div>
	);
}
