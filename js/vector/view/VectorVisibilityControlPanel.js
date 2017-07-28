// Copyright 2016-2017, University of Colorado Boulder

/**
 * Panel that manages options visibility for vectors.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var ArrowNodeCreator = require( 'MASSES_AND_SPRINGS/common/util/ArrowNodeCreator' );
  var inherit = require( 'PHET_CORE/inherit' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var Panel = require( 'SUN/Panel' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var VerticalCheckBoxGroup = require( 'SUN/VerticalCheckBoxGroup' );
  var VStrut = require( 'SCENERY/nodes/VStrut' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );

  // strings
  var velocityString = require( 'string!MASSES_AND_SPRINGS/velocity' );
  var accelerationString = require( 'string!MASSES_AND_SPRINGS/acceleration' );
  var forcesString = require( 'string!MASSES_AND_SPRINGS/forces' );
  var netForceString = require( 'string!MASSES_AND_SPRINGS/netForce' );
  var gravityString = require( 'string!MASSES_AND_SPRINGS/gravity' );
  var springString = require( 'string!MASSES_AND_SPRINGS/spring' );

  /**
   * @param {VectorModel} model
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function VectorVisibilityControlPanel( model, tandem, options ) {
    options = _.extend( {
      showForces: true
    }, options );

    var velocityArrow = new ArrowNodeCreator( 'vector', MassesAndSpringsConstants.VELOCITY_ARROW_COLOR, 'panelVelocityArrow', tandem );
    var accelerationArrow = new ArrowNodeCreator( 'vector', MassesAndSpringsConstants.ACCELERATION_ARROW_COLOR, 'panelAccelerationArrow', tandem );
    var gravityArrow = new ArrowNodeCreator( 'force', MassesAndSpringsConstants.GRAVITY_ARROW_COLOR, 'panelGravityArrow', tandem );
    var springArrow = new ArrowNodeCreator( 'force', MassesAndSpringsConstants.SPRING_ARROW_COLOR, 'panelSpringArrow', tandem );
    var netForceArrow = new ArrowNodeCreator( 'force', 'black', 'panelNetForceArrow', tandem );

    // responsible for velocity and acceleration vectors checkboxes
    var vectorVisibilityCheckBoxGroup = new VerticalCheckBoxGroup( [
      {
        content: new HBox( {
          children: [ new Text( velocityString, {
            font: MassesAndSpringsConstants.FONT,
            tandem: tandem.createTandem( 'velocityString' )
          } ) ]
        } ),
        property: model.velocityVectorVisibilityProperty,
        label: velocityString
      },
      {
        content: new HBox( {
          children: [ new Text( accelerationString, {
            font: MassesAndSpringsConstants.FONT,
            tandem: tandem.createTandem( 'accelerationString' )
          } ) ]
        } ),
        property: model.accelerationVectorVisibilityProperty,
        label: accelerationString
      }
    ], {
      tandem: tandem.createTandem( 'vectorVisibilityCheckBoxGroup' )
    } );

    // responsible for forces vectors checkboxes
    var forcesVisibilityCheckBoxGroup = new VerticalCheckBoxGroup( [
      {
        content: new HBox( {
          children: [ new Text( gravityString, {
            font: MassesAndSpringsConstants.FONT,
            tandem: tandem.createTandem( 'gravityString' )
          } ) ]
        } ),
        property: model.gravityVectorVisibilityProperty,
        label: gravityString
      },
      {
        content: new HBox( {
          children: [ new Text( springString, {
            font: MassesAndSpringsConstants.FONT,
            tandem: tandem.createTandem( 'springString' )
          } ) ]
        } ),
        property: model.springVectorVisibilityProperty,
        label: springString
      }
    ], {
      xMargin: 20,
      tandem: tandem.createTandem( 'vectorVisibilityCheckBoxGroup' )
    } );

    // responsible for forces aquaRadioButton
    var forcesVisibilityRadioButton = new AquaRadioButton(
      model.forcesModeProperty,
      'forces',
      new Text( forcesString, {
        font: MassesAndSpringsConstants.FONT,
        tandem: tandem.createTandem( 'forcesString' )
      } ),
      { radius: 9, spacing: 8 }
    );

    // responsible for net force aquaRadioButton
    var netForceVisibilityRadioButton = new AquaRadioButton(
      model.forcesModeProperty,
      'netForce',
      new HBox( {
        children: [ new Text( netForceString, {
          font: MassesAndSpringsConstants.FONT,
          tandem: tandem.createTandem( 'netForceString' )
        } ) ]
      } ),
      { radius: 9, spacing: 8 }
    );

    // manages the mutability of the forces check boxes dependent on the forces and net force aquaRadioButton
    model.forcesModeProperty.link( function( mode ) {
      if ( mode === 'forces' ) {
        forcesVisibilityCheckBoxGroup.pickable = true;
        forcesVisibilityCheckBoxGroup.opacity = 1;
      }
      else if ( mode === 'netForce' ) {
        forcesVisibilityCheckBoxGroup.pickable = false;
        forcesVisibilityCheckBoxGroup.opacity = 0.3;
      }
    } );

    //Contains all check boxes and radio buttons for vector visibility
    var vectorVisibilityControlsVBox;

    // Contains all vectors for each force
    var vectorVBox;

    // groups the checkboxes and forces aquaRadioButton
    if ( options.showForces ) {
      vectorVisibilityControlsVBox = new VBox( {
          children: [
            new VStrut( 2 ),
            vectorVisibilityCheckBoxGroup,
            new VStrut( 10 ),
            forcesVisibilityRadioButton,
            new VStrut( 10 ),
            new AlignBox( forcesVisibilityCheckBoxGroup, { leftMargin: 15 } ),
            new VStrut( 10 ),
            netForceVisibilityRadioButton
          ],
          align: 'left',
        tandem: tandem.createTandem( 'spacingUnit' )
        }
      );
      vectorVBox = new VBox( {
        children: [
          velocityArrow,
          new VStrut( 14 ),
          accelerationArrow,
          new VStrut( 52 ),
          gravityArrow,
          new VStrut( 14 ),
          springArrow,
          new VStrut( 22 ),
          netForceArrow
        ],
        align: 'left',
        tandem: tandem.createTandem( 'spacingUnit' )
      } );
    }
    else {
      vectorVisibilityControlsVBox = new VBox( {
        children: [
          new VStrut( 2 ),
          vectorVisibilityCheckBoxGroup,
          new VStrut( 10 )
        ],
        align: 'left',
        tandem: tandem.createTandem( 'spacingUnit' )
      } );
      vectorVBox = new VBox( {
        children: [
          velocityArrow,
          new VStrut( 12 ),
          accelerationArrow
        ],
        align: 'left',
        tandem: tandem.createTandem( 'spacingUnit' )
      } );
    }
    var controlsHBox = new HBox( {
        children: [
          vectorVisibilityControlsVBox,
          new HStrut( 10 ),
          vectorVBox,
          new HStrut( 10 )
        ]
      }
    );
    Panel.call( this,
      controlsHBox,
      {
        minWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH,
        xMargin: 10,
        fill: MassesAndSpringsConstants.PANEL_FILL,
        cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
        tandem: tandem.createTandem( 'vectorVisibilityControlPanel' )
      }
    );
    this.mutate( options );
  }

  massesAndSprings.register( 'VectorVisibilityControlPanel', VectorVisibilityControlPanel );

  return inherit( Panel, VectorVisibilityControlPanel );
} );
