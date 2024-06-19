export const getUserId = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user._id : null;
};