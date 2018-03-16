// Copyright 2016-2018, University of Colorado Boulder

/**
 * Intro model (base type) for Masses and Springs
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var MassesAndSpringsModel = require( 'MASSES_AND_SPRINGS/common/model/MassesAndSpringsModel' );
  var Property = require( 'AXON/Property' );
  var PropertyIO = require( 'AXON/PropertyIO' );

  // phet-io modules
  var StringIO = require( 'ifphetio!PHET_IO/types/StringIO' );

  /**
   * @constructor
   * REVIEW: JSDoc for param
   */
  function IntroModel( tandem ) {

    MassesAndSpringsModel.call( this, tandem );
    var self = this;

    this.addDefaultSprings( tandem );
    this.addDefaultMasses( tandem );

    // @public {Property.<string>} determines the scene selection for the intro screen
    //REVIEW: Candidate for an enumeration (see other examples)
    this.sceneModeProperty = new Property( 'same-length', {
      tandem: tandem.createTandem( 'sceneModeProperty' ),
      phetioType: PropertyIO( StringIO ),
      validValues: [ 'same-length', 'adjustable-length' ]
    } );

    // @public {Property.<string|null>} determines which spring property to keep constant in the constants panel
    //REVIEW: Candidate for an enumeration (see other examples). If done, would have a third value that represents what
    //REVIEW: null currently does.
    this.constantParameterProperty = new Property( 'spring-constant', {
      tandem: tandem.createTandem( 'constantParameterProperty' ),
      phetioType: PropertyIO( StringIO ),
      validValues: [ 'spring-constant', 'spring-thickness', null ]
    } );

    // @public {Spring} Renamed for readability. Springs are constantly referenced.
    this.spring1 = this.springs[ 0 ];
    this.spring2 = this.springs[ 1 ];

    // We are updating the spring thickness for each spring, whenever we are on the first scene
    this.springs.forEach( function( spring ) {
      spring.springConstantProperty.link( function( springConstant ) {
        if ( self.sceneModeProperty.get() === 'same-length' ) {
          spring.updateThickness( spring.naturalRestingLengthProperty.get(), springConstant );
        }
      } );
    } );

    // initial parameters set for both scenes
    //REVIEW: Don't need visibility/read-write for a local variable
    // @private {read-write} array of parameters for scene 1
    var sameLengthModeSpringState = this.getSpringState();

    //REVIEW: Don't need visibility/read-write here
    // @private {read-write} array of parameters for scene 2
    this.spring1.naturalRestingLengthProperty.set( MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH / 2 );
    var adjustableLengthModeSpringState = this.getSpringState();

    this.spring1.naturalRestingLengthProperty.set( MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH );

    // Link that is responsible for switching the scenes
    this.sceneModeProperty.lazyLink( function( mode ) {
      if ( mode === 'same-length' ) {

        // Manages stashing and applying parameters to each scene
        self.resetScene( true );

        //REVIEW: Style guide wants one space after //
        //reset the spring stop buttons
        self.spring1.buttonEnabledProperty.reset();
        self.spring2.buttonEnabledProperty.reset();

        // save the state of the adjustable length scene
        adjustableLengthModeSpringState = self.getSpringState();
        self.setSpringState( sameLengthModeSpringState );
      }

      // TODO: Generally prefer enumerations, like AreaCalculationChoice.
      //REVIEW: Yup, see this TODO. Recommended
      else if ( mode === 'adjustable-length' ) {

        // Manages stashing and applying parameters to each scene
        self.resetScene( true );

        //REVIEW: Style guide wants one space after //
        //reset the spring stop buttons
        self.spring1.buttonEnabledProperty.reset();
        self.spring2.buttonEnabledProperty.reset();

        // save the state of the same length scene
        sameLengthModeSpringState = self.getSpringState();
        self.setSpringState( adjustableLengthModeSpringState );
      }
    } );

    // Manages logic for updating spring thickness and spring constant
    //REVIEW: Use `this` instead of self here?
    self.spring1.naturalRestingLengthProperty.link( function( naturalRestingLength ) {

      //REVIEW: Style guide wants one space after //
      //Functions used to determine the inverse relationship between the length and springConstant/thickness
      //  SpringConstant = constant --> As length increases, spring thickness decreases (and vice versa)
      //  Thickness = constant --> As length increases, spring constant decreases  (and vice versa)
      if ( self.constantParameterProperty.get() === 'spring-constant' ) {
        self.spring1.updateThickness( naturalRestingLength, self.spring1.springConstantProperty.get() );
      }
      else if ( self.constantParameterProperty.get() === 'spring-thickness' ) {
        self.spring1.updateSpringConstant( naturalRestingLength, self.spring1.thicknessProperty.get() );
      }
    } );

    //REVIEW: Use `this` instead of self here?
    self.constantParameterProperty.link( function( selectedConstant ) {
      // Manages logic for changing between constant parameters
      // TODO: Enumerate these constants for checks
      if ( selectedConstant === 'spring-constant' ) {
        self.spring1.springConstantProperty.reset();
        self.spring1.updateThickness( self.spring1.naturalRestingLengthProperty.get(), self.spring1.springConstantProperty.get() );
      }
      else if ( selectedConstant === 'spring-thickness' ) {
        self.spring1.thicknessProperty.reset();
        self.spring1.updateSpringConstant( self.spring1.naturalRestingLengthProperty.get(), self.spring1.thicknessProperty.get() );
      }
    } );
  }

  massesAndSprings.register( 'IntroModel', IntroModel );

  return inherit( MassesAndSpringsModel, IntroModel, {

    /**
     * @override
     *
     * @public
     */
    reset: function() {
      MassesAndSpringsModel.prototype.reset.call( this );

      this.sceneModeProperty.reset();
      this.constantParameterProperty.reset();
      this.initializeScenes();
    },

    /**
     * Responsible for preserving the properties of the masses and springs then stores them in a mutable object.
     * @private
     *
     * @returns {Object} REVIEW: More documentation for a bare object.
     */
    getSpringState: function() {
      return {
        spring1State: this.spring1.getSpringState(),
        spring2State: this.spring2.getSpringState()
      };
    },

    /**
     * Responsible for setting the properties of the masses and springs.
     * @param {Object} sceneState: Contains properties of springs and masses. See getSpringState().
     *
     * @private
     */
    setSpringState: function( sceneState ) {
      this.spring1.setSpringState( sceneState.spring1State );
      this.spring2.setSpringState( sceneState.spring2State );
    },

    /**
     * Resets the properties of the masses and springs. The entire sim isn't reset, just the properties affectign the
     * masses and the springs.
     * @private
     *
     * @param {boolean} massesOnly
     */
    resetScene: function( massesOnly ) {
      if ( massesOnly === false ) {
        this.spring1.reset();
        this.spring2.reset();
      }

      this.masses.forEach( function( mass ) {
        mass.reset();
      } );

      // We are resetting the springs' displacement property to recalculate an appropriate length (derived property)
      //REVIEW: Use capitalized Property to talk about Properties
      this.springs.forEach( function( spring ) {
        if ( spring.massAttachedProperty.get() ) {
          spring.massAttachedProperty.reset();
          spring.displacementProperty.reset();
        }
      } );
    },

    /**
     * Resets both scenes of intro screen to initial sim state. This resets only the properties affecting the masses
     * and the springs.
     *
     * @private
     */
    initializeScenes: function() {
      this.sceneModeProperty.set( 'adjustable-length' );
      this.resetScene( false );
      this.spring1.naturalRestingLengthProperty.set( 0.25 );

      // initial parameters set for both scenes
      this.sceneModeProperty.set( 'same-length' );
      this.resetScene( false );
    }
  } );
} )
;
