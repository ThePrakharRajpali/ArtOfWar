<!-- # ArtOfWar


### HOW TO RUN

1. cd techno-static
2. node server/index.js
3. npm start -->

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Thanks again! Now go create something AMAZING! :D
***
***
***
*** To avoid retyping too much info. Do a search and replace for the following:
*** github_username, repo_name, twitter_handle, email, project_title, project_description
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/vikas-4402/ArtOfWar">
    <img src="./readme_assets/Technothlon_full_logo.png" alt="Logo" width="auto" height="80">
  </a>

  <h3 align="center">ArtOfWar</h3>

  <p align="center">
    It is a two-player web-based board game for participants qualified for mains level of  Technothlon
    <br />
    <a href="https://github.com/vikas-4402/ArtOfWar"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/vikas-4402/ArtOfWar">View Demo</a>
    ·
    <a href="https://github.com/theprakharrajpali/ArtOfWar/issues">Report Bug</a>
    ·
    <a href="https://github.com/theprakharrajpali/ArtOfWar/issues">Request Feature</a>
  </p>
</p>

<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* [Shirdam Mahajan](https://github.com/shridam1207)
* [Prakhar Rajpali](https://github.com/ThePrakharRajpali/)
* [Piyush Tiwari](https://github.com/piyush-tiwari)
* [Chekkapalli Venkat Vikas](https://github.com/vikas-4402)
* [Shirin Mansoori](https://github.com/shirin-mansoori)
* [Tanmay Sutar](https://github.com/Tanny2109)
<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <!-- <li><a href="#usage">Usage</a></li> -->
    <!-- <li><a href="#roadmap">Roadmap</a></li> -->
    <li><a href="#rules-for-playing">Rules</a> </li>
    <li><a href="#contributing">Contributing</a></li>
    <!-- <li><a href="#license">License</a></li> -->
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

<!-- [![Product Name Screen Shot][product-screenshot]](https://example.com) -->
ArtOfWar is a two-player web-based board game for participants qualified for mains level of Technothlon.

### Built With

* [Node.js](https://nodejs.org/en/)
* [MongoDB](https://www.mongodb.com/)
* [Express](http://expressjs.com/)
* [React](https://reactjs.org/)
* [Socket.IO](https://socket.io/)
* [Bootstrap]([https](https://getbootstrap.com/))



<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

* npm
  ```sh
  npm install npm@latest -g
  ```

* nodemon 
  ```sh
  npm install -g nodemon
  ```

* mongodb
  <br>
  https://docs.mongodb.com/manual/installation/

  <br>


### Installation

1. Clone the repo
   ```sh
   $ git clone https://github.com/theprakharrajpali/ArtOfWar.git
   ```

2. Change Directory
   ```sh
   $ cd ArtOfWar
   $ cd techno-static
   ```

3. Install NPM packages
   ```sh
   $ npm install
   ```

4. Running the database (in a new terminal)
   ```sh
   $ mongod
   ```

5. Running Server (in a new terminal)
    ```sh
    $ npm run server
    ```

6. Running the game (in a new terminal)
   ```sh
   $ npm start
   ```

7. Opne the following links in your browser:

   http://localhost:5000/

   http://localhost:3000/  (open in two browsers for playing)


<!-- USAGE EXAMPLES -->
<!-- ## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_
 -->


<!-- ROADMAP -->
<!-- ## Roadmap

See the [open issues](https://github.com/theprakharrajpali/ArtOfWar/issues) for a list of proposed features (and known issues).
 -->

## Rules for Playing
### Objective

Capture the flag of opposing team

### Pieces

You have 33 movable pieces.
Each piece has a rank which is the number on it.
You have 1 flag and 6 bomb, which are not movable.
This makes a total of 40 pieces.

### Board

Board is 12 x 10 rectangular grid. There are two lakes in middle. Your piece cannot move on lake.
### Gameplay

* Arrange Your Pieces On board by clicking on panel and then clicking board. You can arrange in only first 4 rows. You can interchange pieces on board by clicking them and swapping them.

    Note: you can rearrange the pieces only before clicking ready.
    
* The way your opponent arranged his/her pieces is hidden to you..
    
* Once you and your opponent are both ready, the game will start. The timer will start running. Both player will be given twenty minutes each.
    
* For moving pieces, you can click on it and move to any one of the green highlighted pieces in 4 directions.
    
* On clicking your piece, if there is an opponent piece in neighbouring squares, it will be highlighted purple. You can click on purple square to attack on opponent's piece.
  
* If you capture opponents flag or your opponent's timer runs out or if opponent resigns, you win.

### Movement And Attacking

* A piece can move to any of its neighbouring squares in one of the four directions, if they are free. These squares will be highlighted.
* If piece(attacking piece) has opponent's piece(defending piece) in neighbouring square, it can attack it. Piece with higher rank wins and losing piece is removed from the board. Winning piece will placed on defending piece's square.
* In case there is a tie, both pieces will die.
* Spy(rank 1 or S) and Bomb have special privileges.
  
    **Spy** : 

    It is a special piece. It is of lowest rank in movable pieces. BUT, if it attacks any piece(apart from bomb), it will always win. But if any other piece attack on Spy, Spy will always lose.

    **Bomb** : 

    It is an immovable piece. Its position is fixed from the start of the game. If any piece(including Spy) (except rank "3") attacks on Bomb, it will blast in 3 x 3 squares around it. Any enemy piece(s) in the radius will die. The bomb will also die/removed. If Rank 3 attacks Bomb, Bomb will die.

* Flag : 
  
It is immovable but most important piece. If you lose flag , you lose the match. 
  
HINTS for defending: You can keep your flag at edges or corners and surround it with bombs and maybe a high ranking piece.

<br>

### Points and Scoring

* For each piece you capture, you will get points equal to its rank. For eg. : if you capture a piece of rank 8, you will get 8 points.
* In case of tie, you won't get any points.
* For each bomb you diffuse(attacking a bomb with rank 3), you will get 5 points.
* If you cature a spy, you will get points equal to rank of piece you captured it with. For eg. : if you capture a spy using rank 6 piece, you will get 6 points.
* If you win the match, you will get 180 points.


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<!-- LICENSE
## License

Distributed under the MIT License. See `LICENSE` for more information.

 -->

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/theprakharrajpali/ArtOfWar.svg?style=for-the-badge
[contributors-url]: https://github.com/theprakharrajpali/ArtOfWar/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/theprakharrajpali/ArtOfWar.svg?style=for-the-badge
[forks-url]: https://github.com/theprakharrajpali/ArtOfWar/network/members
[stars-shield]: https://img.shields.io/github/stars/theprakharrajpali/ArtOfWar.svg?style=for-the-badge
[stars-url]: https://github.com/theprakharrajpali/ArtOfWar/stargazers
[issues-shield]: https://img.shields.io/github/issues/theprakharrajpali/ArtOfWar.svg?style=for-the-badge
[issues-url]: https://github.com/theprakharrajpali/ArtOfWar/issues
[license-shield]: https://img.shields.io/github/license/theprakharrajpali/ArtOfWar.svg?style=for-the-badge
[license-url]: https://github.com/theprakharrajpali/ArtOfWar/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555

