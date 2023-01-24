module.exports = [
    { 
        id: 400,
        trigger: '#FieldGoalFeast + @nstomatoes + #testreplacename_ns',
        responses: [
            {
                start: '2022-11-21 00:00:01',
                end: '2024-12-31 23:59:59',
                responses: [
                    {
                        id: 401, 
                        response: "[@user] Thanks for playing along with our #FieldGoalFeast. You're a real MVP! Catch even more friendly finger footballin' fun on: naturesweet.com/biggame"
                    },
                    {
                        id: 402, 
                        response: "[@user] Nice play! Thanks for joining our #FieldGoalFeast. Tag a friend. Can they beat your high score? naturesweet.com/biggame"
                    }
                ]
            }
        ]
    },
    { 
        id: 403,
        trigger: '#sweepstakes + @nstomatoes + #testreplacename_ns',
        responses: [
            {
                start: '2022-11-21 00:00:01',
                end: '2024-12-31 23:59:59',
                responses: [
                    {
                        id: 404, 
                        response: "[@user] Nicely done. How will you be making NatureSweet tomatoes an MVP of your own game day feast? naturesweet.com/biggame"
                    },
                    {
                        id: 405, 
                        response: "[@user] Nice play! How will you be drafting NatureSweet tomatoes into your own game day feast? naturesweet.com/biggame"
                    }
                ]
            }
        ]
    },
    { 
        id: 406,
        trigger: '#gameday + @nstomatoes + #testreplacename_ns',
        responses: [
            {
                start: '2022-11-21 00:00:01',
                end: '2024-12-31 23:59:59',
                responses: [
                    {
                        id: 407, 
                        response: "[@user] Nice play! How will you be drafting NatureSweet tomatoes into your own game day feast? naturesweet.com/biggame"
                    },
                    {
                        id: 408, 
                        response: "[@user] Nicely done. How will you be making NatureSweet tomatoes an MVP of your own game day feast? naturesweet.com/biggame"
                    }
                ]
            }
        ]
    }
];