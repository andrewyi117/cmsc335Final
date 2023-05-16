Team Members: Andrew Yi (117240764)
App Description: My app is about the kpop group fromis9 which lets you view photos of its members.
    - Sorry I didn't put the css files all in one folder, I had trouble with app.use(express.static(path.join(__dirname, 'css')));
    - MongoDB portion:
        - entering a name then clicking "view member" inserts to the database AND searches for the name right after
          which uses the result from filter to load the correct template
        - visiting the "Enter a name to view a member" page clears the database 
API Links: https://fonts.googleapis.com/css2?family=Nunito:wght@200&display=swap
Youtube Demo Video: https://youtu.be/0EeGZZ3TvWI