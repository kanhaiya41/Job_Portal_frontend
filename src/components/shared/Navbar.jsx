import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Menu, LogOut, User2, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';

const Navbar = () => {
    const { user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch({ type: 'LOGOUT' });
                navigate('/');
                toast.success(res.data.message);
            }
        } catch (error) {

            toast.error(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    <div
                        className="text-2xl font-bold text-foreground cursor-pointer flex items-center"
                        onClick={ () => navigate('/') }
                    >
                        Hire <span className="text-primary ml-1">Hub</span>
                    </div>

                    {/* Mobile Menu Toggle */ }
                    <div className="md:hidden flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={ toggleMenu }
                            className="bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent"
                        >
                            { menuOpen ? (
                                <X className="h-6 w-6 text-foreground" />
                            ) : (
                                <Menu className="h-6 w-6 text-foreground" />
                            ) }
                        </Button>
                    </div>


                    {/* Desktop Navigation */ }
                    <div className="hidden md:flex flex-1 justify-end items-center gap-4">

                        { user ? (
                            <>
                                <ul className="flex font-sans items-center space-x-6 text-muted-foreground">
                                    { user && user.role === 'recruiter' ? (
                                        <>
                                            <Link to='/admin/companies'><li className='cursor-pointer hover:text-primary font-medium transition-colors'>Companies</li></Link>
                                            <Link to='/admin/jobs'><li className='cursor-pointer hover:text-primary font-medium transition-colors' >Jobs</li></Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link to='/'><li className='cursor-pointer hover:text-primary font-medium transition-colors'>Home</li></Link>
                                            <Link to='/jobs'><li className='cursor-pointer hover:text-primary font-medium transition-colors'>Jobs</li></Link>
                                            <Link to='/browse'><li className='cursor-pointer hover:text-primary font-medium transition-colors'>Browse</li></Link>
                                        </>
                                    ) }
                                </ul>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Avatar className="w-8 h-8 rounded-full overflow-hidden cursor-pointer ring-2 ring-primary/20">
                                            <AvatarImage
                                                src={ user?.profile?.profilePhoto ? user?.profile?.profilePhoto : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq8T0hZUoX8kuRi3EZpZbUDtZ_WqqN9Ll15Q&s' }
                                                alt="User Avatar"
                                                className="object-cover w-full h-full"
                                            />
                                        </Avatar>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-4 bg-white border border-border shadow-md rounded-lg w-80">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="w-10 h-10 rounded-full overflow-hidden">
                                                <AvatarImage
                                                    src={ user?.profile?.profilePhoto }
                                                    alt="User Avatar"
                                                    className="object-cover w-full h-full"
                                                />
                                            </Avatar>
                                            <div>
                                                <h1 className="font-semibold text-foreground">{ user?.fullname }</h1>
                                                <p className="text-sm text-muted-foreground">{ user?.profile?.bio }</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex justify-between items-center gap-2">
                                            { user && user.role === 'student' && (
                                                <Link to="/profile">
                                                    <Button variant="ghost" size="sm" className="flex items-center gap-1 text-primary hover:text-primary/80">
                                                        <User2 className="w-4 h-4" />
                                                        View Profile
                                                    </Button>
                                                </Link>
                                            ) }
                                            <Button
                                                onClick={ logoutHandler }
                                                variant="ghost"
                                                size="sm"
                                                className="flex items-center gap-1 text-destructive hover:text-destructive/80"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </Button>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </>
                        ) : (
                            <>
                                <ul className="flex font-sans items-center space-x-6 text-muted-foreground">
                                    <Link to="/">
                                        <li className="cursor-pointer hover:text-primary font-medium transition-colors">Home</li>
                                    </Link>
                                    <Link to="/jobs">
                                        <li className="cursor-pointer hover:text-primary font-medium transition-colors">Jobs</li>
                                    </Link>
                                    <Link to="/browse">
                                        <li className="cursor-pointer hover:text-primary font-medium transition-colors">Browse</li>
                                    </Link>
                                </ul>
                                <Link to="/login">
                                    <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Signup</Button>
                                </Link>
                            </>
                        ) }
                    </div>
                </div>
            </div>

            {/* Mobile Menu */ }
            { menuOpen && (
                <div className="absolute top-16 left-0 right-0 bg-white border-b border-border p-4 md:hidden z-50">
                    <ul className="space-y-4 text-muted-foreground">
                        <li className="cursor-pointer hover:text-primary font-medium">
                            <Link to="/">Home</Link>
                        </li>
                        <li className="cursor-pointer hover:text-primary font-medium">
                            <Link to="/jobs">Jobs</Link>
                        </li>
                        <li className="cursor-pointer hover:text-primary font-medium">
                            <Link to="/browse">Browse</Link>
                        </li>
                        { !user && (
                            <div className="flex flex-col gap-2 pt-2 border-t border-border mt-2">
                                <Link to="/login">
                                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 justify-center">
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground justify-center">Signup</Button>
                                </Link>
                            </div>
                        ) }
                    </ul>
                </div>
            ) }
        </nav>
    );
};

export default Navbar;
