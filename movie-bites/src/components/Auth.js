import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
	const { handleLogin } = useAuth();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: '',
		password: ''
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleSubmit = async (e) => {
	e.preventDefault();
	const result = await handleLogin(formData);
	console.log(result);
	if (result.success) {
		navigate('/movies');
	}
};

	return (
		<div className="bg-rust text-rust-cream py-3 rounded-2 mt-3 mb-3 shadow-lg">
			<div className="container">
				<h4 className="mb-3">Login</h4>
				<form onSubmit={handleSubmit}>
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
						Login
					</button>
				</form>
			</div>
		</div>
	);
}

