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
   * TODO:: There has to be a better way to manage all of these properties as one entity without using propertySet()
   * @constructor
   */
  function IntroModel( tandem ) {

    MassesAndSpringsModel.call( this, tandem );
    var self = this;

    //TODO: Move into the intro Model.
    // @public {Property.<string>} determines the scene selection for the intro screen
    this.springLengthModeProperty = new Property( 'same-length', {
      tandem: tandem.createTandem( 'springLengthModeProperty' ),
      phetioValueType: TString,
      validValues: [ 'same-length', 'adjustable-length' ]
    } );

    // TODO: This is specific to Intro Screen. Move to Intro Model. Refactor into "constantParameter"
    // @public {Property.<string|null>} determines which spring property to keep constant in the constants panel
    this.constantParameterProperty = new Property( 'spring-constant', {
      tandem: tandem.createTandem( 'constantParameterProperty' ),
      phetioValueType: TString,
      validValues: [ 'spring-constant', 'spring-thickness', null ]
    } );

    // Renamed for readability. Springs are constantly referenced.
    this.spring1 = this.springs[ 0 ];
    this.spring2 = this.springs[ 1 ];

    // TODO: Move into intro model.
    this.springs.forEach( function( spring ) {
      spring.springConstantProperty.link( function( springConstant ) {
        if ( self.springLengthModeProperty.get() === 'same-length' ) {
          spring.updateThickness( spring.naturalRestingLengthProperty.get(), springConstant );
        }
      } );
    } );

    // initial parameters set for both scenes
    // @private {read-write} array of parameters for scene 1
    var scene1Parameters = this.stashSceneParameters();

    // @private {read-write} array of parameters for scene 2
    this.spring1.naturalRestingLengthProperty.set( MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH / 2 );
    var scene2Parameters = this.stashSceneParameters();

    this.spring1.naturalRestingLengthProperty.set( MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH );

    // Link that is responsible for switching the scenes
    this.springLengthModeProperty.lazyLink( function( mode ) {
      /**@private Functions used to determine the inverse relationship between the length and springConstant/thickness
       Functions follow logic:
       -SpringConstant = constant --> As length increases, spring thickness decreases (and vice versa)
       -Thickness = constant -->As length increases, spring constant decreases  (and vice versa)
       */

      // Restoring spring parameters when scenes are switched
      if ( mode === 'same-length' ) {
        // Manages stashing and applying parameters to each scene
        scene2Parameters = self.stashSceneParameters();
        self.applySceneParameters( scene1Parameters );
      }

      else if ( mode === 'adjustable-length' ) {
        // Manages stashing and applying parameters to each scene
        scene1Parameters = self.stashSceneParameters();
        self.applySceneParameters( scene2Parameters );

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
     * @public
     */
    reset: function() {
      // debugger;
      MassesAndSpringsModel.prototype.reset.call( this );
      this.springLengthModeProperty.reset();
      this.constantParameterProperty.reset();
      //this.resetSceneParameters();
      console.log( 'Reset called' );
    },

    // TODO: Move spring elements into spring.js. Move Mass elements into mass.js. With methods to getState()
    stashSceneParameters: function() {
      // @private {read-only} Stashing parameters for first spring
      var sceneSpring1Properties = {
        displacement: this.spring1.displacementProperty.get(),
        gravity: this.spring1.gravityProperty.get(),
        dampingCoefficient: this.spring1.dampingCoefficientProperty.get(),
        position: this.spring1.positionProperty.get(),
        naturalRestingLength: this.spring1.naturalRestingLengthProperty.get(),
        animating: this.spring1.animatingProperty.get(),
        mass: this.spring1.massProperty.get(),
        springConstant: this.spring1.springConstantProperty.get()
      };

      // @private {read-only} Stashing parameters for mass attached to first spring
      if ( this.spring1.massProperty.get() ) {
        var sceneSpring1MassProperties = {
          mass: this.spring1.massProperty.get().mass,
          position: this.spring1.massProperty.get().positionProperty.get(),
          userControlledProperty: this.spring1.massProperty.get().userControlledProperty.get(),
          verticalVelocity: this.spring1.massProperty.get().verticalVelocityProperty.get(),
          spring: this.spring1.massProperty.get().springProperty.get()
        };
      }

      // @private {read-only} Stashing parameters for first spring
      var sceneSpring2Properties = {
        displacement: this.spring2.displacementProperty.get(),
        gravity: this.spring2.gravityProperty.get(),
        dampingCoefficient: this.spring2.dampingCoefficientProperty.get(),
        position: this.spring2.positionProperty.get(),
        naturalRestingLength: this.spring2.naturalRestingLengthProperty.get(),
        animating: this.spring2.animatingProperty.get(),
        mass: this.spring2.massProperty.get(),
        springConstant: this.spring2.springConstantProperty.get()
      };

      // @private {read-only} Stashing parameters for mass attached to first spring
      if ( this.spring2.massProperty.get() ) {
        var sceneSpring2MassProperties = {
          mass: this.spring2.massProperty.get().mass,
          position: this.spring2.massProperty.get().positionProperty.get(),
          userControlledProperty: this.spring2.massProperty.get().userControlledProperty.get(),
          verticalVelocity: this.spring2.massProperty.get().verticalVelocityProperty.get(),
          spring: this.spring2.massProperty.get().springProperty.get()
        };
      }

      // @private {read-only} Stashing parameters for mass attached to 250g grey mass
      var sceneMass1 = {
        mass: this.masses.largeLabeledMass.mass,
        position: this.masses.largeLabeledMass.positionProperty.get(),
        userControlled: this.masses.largeLabeledMass.userControlledProperty.get(),
        verticalVelocity: this.masses.largeLabeledMass.verticalVelocityProperty.get(),
        spring: this.masses.largeLabeledMass.springProperty.get()
      };

      // @private {read-only} Stashing parameters for mass attached to first 100g grey mass
      var sceneMass2 = {
        mass: this.masses.mediumLabeledMass1.mass,
        position: this.masses.mediumLabeledMass1.positionProperty.get(),
        userControlled: this.masses.mediumLabeledMass1.userControlledProperty.get(),
        verticalVelocity: this.masses.mediumLabeledMass1.verticalVelocityProperty.get(),
        spring: this.masses.mediumLabeledMass1.springProperty.get()
      };

      // @private {read-only} Stashing parameters for mass attached to second 100g grey mass
      var sceneMass3 = {
        mass: this.masses.mediumLabeledMass2.mass,
        position: this.masses.mediumLabeledMass2.positionProperty.get(),
        userControlled: this.masses.mediumLabeledMass2.userControlledProperty.get(),
        verticalVelocity: this.masses.mediumLabeledMass2.verticalVelocityProperty.get(),
        spring: this.masses.mediumLabeledMass2.springProperty.get()
      };

      // @private {read-only} Stashing parameters for mass attached to 50g grey mass
      var sceneMass4 = {
        mass: this.masses.smallLabeledMass.mass,
        position: this.masses.smallLabeledMass.positionProperty.get(),
        userControlled: this.masses.smallLabeledMass.userControlledProperty.get(),
        verticalVelocity: this.masses.smallLabeledMass.verticalVelocityProperty.get(),
        spring: this.masses.smallLabeledMass.springProperty.get()
      };

      // @private {read-only} Stashing parameters for mass attached to 200g blue mass
      var sceneMass5 = {
        mass: this.masses.largeUnlabeledMass.mass,
        position: this.masses.largeUnlabeledMass.positionProperty.get(),
        userControlled: this.masses.largeUnlabeledMass.userControlledProperty.get(),
        verticalVelocity: this.masses.largeUnlabeledMass.verticalVelocityProperty.get(),
        spring: this.masses.largeUnlabeledMass.springProperty.get()
      };

      // @private {read-only} Stashing parameters for mass attached to 150g green mass
      var sceneMass6 = {
        mass: this.masses.mediumUnlabeledMass.mass,
        position: this.masses.mediumUnlabeledMass.positionProperty.get(),
        userControlled: this.masses.mediumUnlabeledMass.userControlledProperty.get(),
        verticalVelocity: this.masses.mediumUnlabeledMass.verticalVelocityProperty.get(),
        spring: this.masses.mediumUnlabeledMass.springProperty.get()
      };

      // @private {read-only} Stashing parameters for mass attached to 75g red mass
      var sceneMass7 = {
        mass: this.masses.smallUnlabeledMass.mass,
        position: this.masses.smallUnlabeledMass.positionProperty.get(),
        userControlled: this.masses.smallUnlabeledMass.userControlledProperty.get(),
        verticalVelocity: this.masses.smallUnlabeledMass.verticalVelocityProperty.get(),
        spring: this.masses.smallUnlabeledMass.springProperty.get()
      };

      // @private {read-only} Stashing sceneMasses into one object
      var massesState = {
        sceneMass1: sceneMass1,
        sceneMass2: sceneMass2,
        sceneMass3: sceneMass3,
        sceneMass4: sceneMass4,
        sceneMass5: sceneMass5,
        sceneMass6: sceneMass6,
        sceneMass7: sceneMass7
      };

      // @private {read-only} Stashing spring 1 parameters into one object
      var spring1State = {
        sceneSpring1: sceneSpring1Properties,
        sceneSpring1Mass: sceneSpring1MassProperties
      };

      // @private {read-only} Stashing spring 2 parameters into one object
      var spring2State = {
        sceneSpring2: sceneSpring2Properties,
        sceneSpring2Mass: sceneSpring2MassProperties
      };

      // @public {read-write} Array that contains all of the parameters associated with the spring and mass states
      var parameters = {
        spring1State: spring1State,
        spring2State: spring2State,
        massesState: massesState
      };
      return parameters;
    },

    // TODO: Move to IntroModel
    // TODO: Create object structure and provide loop for applying parameters
    applySceneParameters: function( parameters ) {
      // Applying stashed parameters of first spring
      this.spring1.displacementProperty.set( parameters.spring1State.sceneSpring1.displacement );
      this.spring1.gravityProperty.set( parameters.spring1State.sceneSpring1.gravity );
      this.spring1.dampingCoefficientProperty.set( parameters.spring1State.sceneSpring1.dampingCoefficient );
      this.spring1.positionProperty.set( parameters.spring1State.sceneSpring1.position );
      this.spring1.naturalRestingLengthProperty.set( parameters.spring1State.sceneSpring1.naturalRestingLength );
      this.spring1.animatingProperty.set( parameters.spring1State.sceneSpring1.animating );
      this.spring1.massProperty.set( parameters.spring1State.sceneSpring1.mass );
      this.spring1.springConstantProperty.set( parameters.spring1State.sceneSpring1.springConstant );

      // Handle applying stashed parameters of first spring if mass is attached
      if ( this.spring1.massProperty.get() ) {
        this.spring1.massProperty.get().mass = parameters.spring1State.sceneSpring1Mass.mass;
        this.spring1.massProperty.get().positionProperty.set( parameters.spring1State.sceneSpring1Mass.position );
        this.spring1.massProperty.get().userControlledProperty.set( parameters.spring1State.sceneSpring1Mass.userControlledProperty );
        this.spring1.massProperty.get().verticalVelocityProperty.set( parameters.spring1State.sceneSpring1Mass.verticalVelocity );
        this.spring1.massProperty.get().springProperty.set( parameters.spring1State.sceneSpring1Mass.spring );
      }
      // Applying stashed parameters of first spring
      this.spring2.displacementProperty.set( parameters.spring2State.sceneSpring2.displacement );
      this.spring2.gravityProperty.set( parameters.spring2State.sceneSpring2.gravity );
      this.spring2.dampingCoefficientProperty.set( parameters.spring2State.sceneSpring2.dampingCoefficient );
      this.spring2.positionProperty.set( parameters.spring2State.sceneSpring2.position );
      this.spring2.naturalRestingLengthProperty.set( parameters.spring2State.sceneSpring2.naturalRestingLength );
      this.spring2.animatingProperty.set( parameters.spring2State.sceneSpring2.animating );
      this.spring2.massProperty.set( parameters.spring2State.sceneSpring2.mass );
      this.spring2.springConstantProperty.set( parameters.spring2State.sceneSpring2.springConstant );

      // Handle applying stashed parameters of first spring if mass is attached
      if ( this.spring2.massProperty.get() ) {
        this.spring2.massProperty.get().mass = parameters.spring2State.sceneSpring2Mass.mass;
        this.spring2.massProperty.get().positionProperty.set( parameters.spring2State.sceneSpring2Mass.position );
        this.spring2.massProperty.get().userControlledProperty.set( parameters.spring2State.sceneSpring2Mass.userControlledProperty );
        this.spring2.massProperty.get().verticalVelocityProperty.set( parameters.spring2State.sceneSpring2Mass.verticalVelocity );
        this.spring2.massProperty.get().springProperty.set( parameters.spring2State.sceneSpring2Mass.spring );
      }

      // Applying stashed parameters of 250g grey mass
      this.masses.largeLabeledMass.mass = parameters.massesState.sceneMass1.mass;
      this.masses.largeLabeledMass.positionProperty.set( parameters.massesState.sceneMass1.position );
      this.masses.largeLabeledMass.userControlledProperty.set( parameters.massesState.sceneMass1.userControlled );
      this.masses.largeLabeledMass.verticalVelocityProperty.set( parameters.massesState.sceneMass1.verticalVelocity );
      this.masses.largeLabeledMass.springProperty.set( parameters.massesState.sceneMass1.spring );

      // Applying stashed parameters of first 100g grey mass
      this.masses.mediumLabeledMass1.mass = parameters.massesState.sceneMass2.mass;
      this.masses.mediumLabeledMass1.positionProperty.set( parameters.massesState.sceneMass2.position );
      this.masses.mediumLabeledMass1.userControlledProperty.set( parameters.massesState.sceneMass2.userControlled );
      this.masses.mediumLabeledMass1.verticalVelocityProperty.set( parameters.massesState.sceneMass2.verticalVelocity );
      this.masses.mediumLabeledMass1.springProperty.set( parameters.massesState.sceneMass2.spring );

      // Applying stashed parameters of second 100g grey mass
      this.masses.mediumLabeledMass2.mass = parameters.massesState.sceneMass3.mass;
      this.masses.mediumLabeledMass2.positionProperty.set( parameters.massesState.sceneMass3.position );
      this.masses.mediumLabeledMass2.userControlledProperty.set( parameters.massesState.sceneMass3.userControlled );
      this.masses.mediumLabeledMass2.verticalVelocityProperty.set( parameters.massesState.sceneMass3.verticalVelocity );
      this.masses.mediumLabeledMass2.springProperty.set( parameters.massesState.sceneMass3.spring );

      // Applying stashed parameters of 50g grey mass
      this.masses.smallLabeledMass.mass = parameters.massesState.sceneMass4.mass;
      this.masses.smallLabeledMass.positionProperty.set( parameters.massesState.sceneMass4.position );
      this.masses.smallLabeledMass.userControlledProperty.set( parameters.massesState.sceneMass4.userControlled );
      this.masses.smallLabeledMass.verticalVelocityProperty.set( parameters.massesState.sceneMass4.verticalVelocity );
      this.masses.smallLabeledMass.springProperty.set( parameters.massesState.sceneMass4.spring );

      // Applying stashed parameters of 200g blue mass
      this.masses.largeUnlabeledMass.mass = parameters.massesState.sceneMass5.mass;
      this.masses.largeUnlabeledMass.positionProperty.set( parameters.massesState.sceneMass5.position );
      this.masses.largeUnlabeledMass.userControlledProperty.set( parameters.massesState.sceneMass5.userControlled );
      this.masses.largeUnlabeledMass.verticalVelocityProperty.set( parameters.massesState.sceneMass5.verticalVelocity );
      this.masses.largeUnlabeledMass.springProperty.set( parameters.massesState.sceneMass5.spring );

      // Applying stashed parameters of 150g green mass
      this.masses.mediumUnlabeledMass.mass = parameters.massesState.sceneMass6.mass;
      this.masses.mediumUnlabeledMass.positionProperty.set( parameters.massesState.sceneMass6.position );
      this.masses.mediumUnlabeledMass.userControlledProperty.set( parameters.massesState.sceneMass6.userControlled );
      this.masses.mediumUnlabeledMass.verticalVelocityProperty.set( parameters.massesState.sceneMass6.verticalVelocity );
      this.masses.mediumUnlabeledMass.springProperty.set( parameters.massesState.sceneMass6.spring );

      // Applying stashed parameters of 75g red mass
      this.masses.smallUnlabeledMass.mass = parameters.massesState.sceneMass7.mass;
      this.masses.smallUnlabeledMass.positionProperty.set( parameters.massesState.sceneMass7.position );
      this.masses.smallUnlabeledMass.userControlledProperty.set( parameters.massesState.sceneMass7.userControlled );
      this.masses.smallUnlabeledMass.verticalVelocityProperty.set( parameters.massesState.sceneMass7.verticalVelocity );
      this.masses.smallUnlabeledMass.springProperty.set( parameters.massesState.sceneMass7.spring );
    },

    resetSceneParameters: function() {
      console.log( 'reset' );
      // Applying stashed parameters of first spring
      this.spring1.displacementProperty.reset();
      this.spring1.gravityProperty.reset();
      this.spring1.dampingCoefficientProperty.reset();
      this.spring1.positionProperty.reset();
      this.spring1.naturalRestingLengthProperty.reset();
      this.spring1.animatingProperty.reset();
      this.spring1.massProperty.reset();
      this.spring1.springConstantProperty.reset();

      // Handle applying stashed parameters of first spring if mass is attached
      if ( this.spring1.massProperty.get() ) {
        this.spring1.massProperty.get().mass = null;
        this.spring1.massProperty.get().positionProperty.reset();
        this.spring1.massProperty.get().userControlledProperty.reset();
        this.spring1.massProperty.get().verticalVelocityProperty.reset();
        this.spring1.massProperty.get().springProperty.reset();
      }
      // Applying stashed parameters of first spring
      this.spring2.displacementProperty.reset();
      this.spring2.gravityProperty.reset();
      this.spring2.dampingCoefficientProperty.reset();
      this.spring2.positionProperty.reset();
      this.spring2.naturalRestingLengthProperty.reset();
      this.spring2.animatingProperty.reset();
      this.spring2.massProperty.reset();
      this.spring2.springConstantProperty.reset();

      // Handle applying stashed parameters of first spring if mass is attached
      if ( this.spring2.massProperty.get() ) {
        this.spring2.massProperty.get().mass = null;
        this.spring2.massProperty.get().positionProperty.reset();
        this.spring2.massProperty.get().userControlledProperty.reset();
        this.spring2.massProperty.get().verticalVelocityProperty.reset();
        this.spring2.massProperty.get().springProperty.reset();
      }

      // Applying stashed parameters of 250g grey mass
      this.masses[ 0 ].mass = null;
      this.masses[ 0 ].positionProperty.reset();
      this.masses[ 0 ].userControlledProperty.reset();
      this.masses[ 0 ].verticalVelocityProperty.reset();
      this.masses[ 0 ].springProperty.reset();

      // Applying stashed parameters of first 100g grey mass
      this.masses[ 1 ].mass = null;
      this.masses[ 1 ].positionProperty.reset();
      this.masses[ 1 ].userControlledProperty.reset();
      this.masses[ 1 ].verticalVelocityProperty.reset();
      this.masses[ 1 ].springProperty.reset();

      // Applying stashed parameters of second 100g grey mass
      this.masses[ 2 ].mass = null;
      this.masses[ 2 ].positionProperty.reset();
      this.masses[ 2 ].userControlledProperty.reset();
      this.masses[ 2 ].verticalVelocityProperty.reset();
      this.masses[ 2 ].springProperty.reset();

      // Applying stashed parameters of 50g grey mass
      this.masses[ 3 ].mass = null;
      this.masses[ 3 ].positionProperty.reset();
      this.masses[ 3 ].userControlledProperty.reset();
      this.masses[ 3 ].verticalVelocityProperty.reset();
      this.masses[ 3 ].springProperty.reset();

      // Applying stashed parameters of 200g blue mass
      this.masses[ 4 ].mass = null;
      this.masses[ 4 ].positionProperty.reset();
      this.masses[ 4 ].userControlledProperty.reset();
      this.masses[ 4 ].verticalVelocityProperty.reset();
      this.masses[ 4 ].springProperty.reset();

      // Applying stashed parameters of 150g green mass
      this.masses[ 5 ].mass = null;
      this.masses[ 5 ].positionProperty.reset();
      this.masses[ 5 ].userControlledProperty.reset();
      this.masses[ 5 ].verticalVelocityProperty.reset();
      this.masses[ 5 ].springProperty.reset();

      // Applying stashed parameters of 75g red mass
      this.masses[ 6 ].mass = null;
      this.masses[ 6 ].positionProperty.reset();
      this.masses[ 6 ].userControlledProperty.reset();
      this.masses[ 6 ].verticalVelocityProperty.reset();
      this.masses[ 6 ].springProperty.reset();
    }
  } );
} );