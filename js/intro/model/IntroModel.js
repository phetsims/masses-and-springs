// Copyright 2016-2017, University of Colorado Boulder

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
  var MassesAndSpringsModel = require( 'MASSES_AND_SPRINGS/common/model/MassesAndSpringsModel' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Property = require( 'AXON/Property' );

  // phet-io modules
  var TString = require( 'ifphetio!PHET_IO/types/TString' );

  /**
   * TODO:: document all properties and items set on objects (entire sim)
   * @constructor
   */
  function IntroModel( tandem ) {

    MassesAndSpringsModel.call( this, tandem, { springCount: 2 } );
    var self = this;

    //TODO: Move into the intro Model.
    // @public {Property.<string>} determines the scene selection for the intro screen
    this.sceneModeProperty = new Property( 'same-length', {
      tandem: tandem.createTandem( 'sceneModeProperty' ),
      phetioValueType: TString,
      validValues: [ 'same-length', 'adjustable-length' ]
    } );

    // @public {Property.<string|null>} determines which spring property to keep constant in the constants panel
    this.constantParameterProperty = new Property( 'spring-constant', {
      tandem: tandem.createTandem( 'constantParameterProperty' ),
      phetioValueType: TString,
      validValues: [ 'spring-constant', 'spring-thickness', null ]
    } );

    // Renamed for readability. Springs are constantly referenced.
    this.spring1 = this.springs[ 0 ];
    this.spring2 = this.springs[ 1 ];

    this.springs.forEach( function( spring ) {
      spring.springConstantProperty.link( function( springConstant ) {
        if ( self.sceneModeProperty.get() === 'same-length' ) {
          spring.updateThickness( spring.naturalRestingLengthProperty.get(), springConstant );
        }
      } );
    } );

    // initial parameters set for both scenes
    // @private {read-write} array of parameters for scene 1
    var scene1Parameters = this.getSceneState();

    // @private {read-write} array of parameters for scene 2
    this.spring1.naturalRestingLengthProperty.set( MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH / 2 );
    var scene2Parameters = this.getSceneState();

    this.spring1.naturalRestingLengthProperty.set( MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH );

    // Link that is responsible for switching the scenes
    this.sceneModeProperty.lazyLink( function( mode ) {
      /**Functions used to determine the inverse relationship between the length and springConstant/thickness
       Functions follow logic:
       -SpringConstant = constant --> As length increases, spring thickness decreases (and vice versa)
       -Thickness = constant -->As length increases, spring constant decreases  (and vice versa)
       */
      // Restoring spring parameters when scenes are switched
      if ( mode === 'same-length' ) {
        // Manages stashing and applying parameters to each scene
        self.setResetState( true );
        scene2Parameters = self.getSceneState();
        self.setSceneState( scene1Parameters );
      }

      else if ( mode === 'adjustable-length' ) {
        // Manages stashing and applying parameters to each scene
        self.setResetState( true );
        scene1Parameters = self.getSceneState();
        self.setSceneState( scene2Parameters );

        // Manages logic for updating spring thickness and spring constant
        self.spring1.naturalRestingLengthProperty.link( function( naturalRestingLength ) {
          if ( self.constantParameterProperty.get() === 'spring-constant' ) {
            self.spring1.updateThickness( naturalRestingLength, self.spring1.springConstantProperty.get() );
          }
          else if ( self.constantParameterProperty.get() === 'spring-thickness' ) {
            self.spring1.updateSpringConstant( naturalRestingLength, self.spring1.thicknessProperty.get() );
          }
        } );

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
      // // Used for testing purposes
      // Property.multilink( [ self.spring1.springConstantProperty, self.spring1.thicknessProperty ], function( springConstant, springThickness ) {
      //
      //   console.log( 'springConstant = ' + springConstant + '\t\t' + 'thickness = ' + springThickness );
      // } );
    } );
  }

  massesAndSprings.register( 'IntroModel', IntroModel );

  return inherit( MassesAndSpringsModel, IntroModel, {

    /**
     * @override
     *
     * @private
     */
    reset: function() {
      MassesAndSpringsModel.prototype.reset.call( this );
      this.sceneModeProperty.reset();
      this.constantParameterProperty.reset();
      this.getResetState();
    },

    /**
     * Responsible for preserving the properties of the masses and springs then stores them in a mutable object.
     *
     * @private
     */
    getSceneState: function() {
      var spring1State = this.spring1.getSpringState();
      var spring2State = this.spring2.getSpringState();

      return {
        spring1State: spring1State,
        spring2State: spring2State
      };
    },

    /**
     * Responsible for setting the properties of the masses and springs.
     * @param {Object} sceneState: Contains properties of springs and masses
     *
     * @private
     */
    setSceneState: function( sceneState ) {
      this.spring1.setSpringState( sceneState.spring1State );
      this.spring2.setSpringState( sceneState.spring2State );
    },

    /**
     * Resets the properties of the masses and springs
     *
     * @private
     */
    setResetState: function( massesOnly ) {
      if ( massesOnly === false ) {
        this.spring1.reset();
        this.spring2.reset();
        _.values( this.masses ).forEach( function( mass ) {
          mass.reset();
        } );
      }
      _.values( this.masses ).forEach( function( mass ) {
        mass.reset();
      } );

      // We are resetting the springs' displacement property to recalculate an appropriate length (derived property)
      if ( this.spring1.massProperty.get() || this.spring2.massProperty.get() ) {
        this.spring1.massProperty.reset();
        this.spring2.massProperty.reset();
        this.spring1.displacementProperty.reset();
        this.spring2.displacementProperty.reset();
      }
    },

    /**
     * Resets both scenes of intro screen.
     *
     * @private
     */
    getResetState: function() {
      this.sceneModeProperty.set( 'adjustable-length' );
      this.setResetState( false );
      this.spring1.naturalRestingLengthProperty.set( .25 );

      // initial parameters set for both scenes
      // @private {read-write} array of parameters for scene 1
      this.sceneModeProperty.set( 'same-length' );
      this.setResetState( false );
    }
  } );
} )
;
