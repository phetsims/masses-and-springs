// Copyright 2017-2018, University of Colorado Boulder

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
  var ForceVectorArrow = require( 'MASSES_AND_SPRINGS/common/view/ForceVectorArrow' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Panel = require( 'SUN/Panel' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var VectorArrow = require( 'MASSES_AND_SPRINGS/common/view/VectorArrow' );
  var VerticalCheckboxGroup = require( 'SUN/VerticalCheckboxGroup' );
  var VStrut = require( 'SCENERY/nodes/VStrut' );

  // strings
  var accelerationString = require( 'string!MASSES_AND_SPRINGS/acceleration' );
  var forcesString = require( 'string!MASSES_AND_SPRINGS/forces' );
  var gravityString = require( 'string!MASSES_AND_SPRINGS/gravity' );
  var netForceString = require( 'string!MASSES_AND_SPRINGS/netForce' );
  var springString = require( 'string!MASSES_AND_SPRINGS/spring' );
  var velocityString = require( 'string!MASSES_AND_SPRINGS/velocity' );

  /**
   * @param {VectorModel} model
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function VectorVisibilityControlPanel( model, tandem, options ) {
    options = _.extend( {
      showForces: true,
      minWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH,
      xMargin: 10,
      fill: MassesAndSpringsConstants.PANEL_FILL,
      cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
      tandem: tandem.createTandem( 'vectorVisibilityControlPanel' )
    }, options );

    var velocityArrow = new VectorArrow(
      MassesAndSpringsConstants.VELOCITY_ARROW_COLOR, 'panelVelocityArrow', tandem
    );
    var accelerationArrow = new VectorArrow(
      MassesAndSpringsConstants.ACCELERATION_ARROW_COLOR, 'panelAccelerationArrow', tandem
    );
    var gravityArrow = new ForceVectorArrow(
      MassesAndSpringsConstants.GRAVITY_ARROW_COLOR, 'panelGravityArrow', tandem
    );
    var springArrow = new ForceVectorArrow( MassesAndSpringsConstants.SPRING_ARROW_COLOR, 'panelSpringArrow', tandem );
    var netForceArrow = new ForceVectorArrow( 'black', 'panelNetForceArrow', tandem );

    // responsible for velocity and acceleration vectors checkboxes
    var vectorVisibilityCheckboxGroup = new VerticalCheckboxGroup( [ {
      content: new HBox( {
        children: [ new Text( velocityString, {
          font: MassesAndSpringsConstants.TITLE_FONT,
          tandem: tandem.createTandem( 'velocityString' )
        } ) ]
      } ),
      property: model.velocityVectorVisibilityProperty,
      label: velocityString
    }, {
      content: new HBox( {
        children: [ new Text( accelerationString, {
          font: MassesAndSpringsConstants.TITLE_FONT,
          tandem: tandem.createTandem( 'accelerationString' )
        } ) ]
      } ),
      property: model.accelerationVectorVisibilityProperty,
      label: accelerationString
    }
    ], {
      boxWidth: 15,
      tandem: tandem.createTandem( 'vectorVisibilityCheckboxGroup' )
    } );

    // responsible for forces vectors checkboxes
    var forcesVisibilityCheckboxGroup = new VerticalCheckboxGroup( [ {
      content: new HBox( {
        children: [ new Text( gravityString, {
          font: MassesAndSpringsConstants.TITLE_FONT,
          tandem: tandem.createTandem( 'gravityString' )
        } ) ]
      } ),
      property: model.gravityVectorVisibilityProperty,
      label: gravityString
    }, {
      content: new HBox( {
        children: [ new Text( springString, {
          font: MassesAndSpringsConstants.TITLE_FONT,
          tandem: tandem.createTandem( 'springString' )
        } ) ]
      } ),
      property: model.springVectorVisibilityProperty,
      label: springString
    } ], {
      boxWidth: 15,
      xMargin: 20,
      tandem: tandem.createTandem( 'vectorVisibilityCheckboxGroup' )
    } );

    // responsible for forces aquaRadioButton
    var forcesVisibilityRadioButton = new AquaRadioButton(
      model.forcesModeProperty,
      'forces',
      new Text( forcesString, {
        font: MassesAndSpringsConstants.TITLE_FONT,
        tandem: tandem.createTandem( 'forcesString' )
      } ),
      { radius: 7, spacing: 7 }
    );

    // responsible for net force aquaRadioButton
    var netForceVisibilityRadioButton = new AquaRadioButton(
      model.forcesModeProperty,
      'netForce',
      new HBox( {
        children: [ new Text( netForceString, {
          font: MassesAndSpringsConstants.TITLE_FONT,
          tandem: tandem.createTandem( 'netForceString' )
        } ) ]
      } ),
      { radius: 7, spacing: 7 }
    );

    // manages the mutability of the forces checkboxes dependent on the forces and net force aquaRadioButton
    model.forcesModeProperty.link( function( mode ) {
      if ( mode === 'forces' ) {
        forcesVisibilityCheckboxGroup.pickable = true;
        forcesVisibilityCheckboxGroup.opacity = 1;
      }
      else if ( mode === 'netForce' ) {
        forcesVisibilityCheckboxGroup.pickable = false;
        forcesVisibilityCheckboxGroup.opacity = 0.3;
      }
    } );

    //Contains all checkboxes and radio buttons for vector visibility
    var vectorVisibilityControlsVBox;

    // Contains all vectors for each force
    var vectorVBox;

    // groups the checkboxes and forces aquaRadioButton
    if ( options.showForces ) {
      vectorVisibilityControlsVBox = new VBox( {
          children: [
            vectorVisibilityCheckboxGroup,
            new VStrut( 8 ),
            forcesVisibilityRadioButton,
            new VStrut( 8 ),
            new AlignBox( forcesVisibilityCheckboxGroup, { leftMargin: 15 } ),
            new VStrut( 8 ),
            netForceVisibilityRadioButton
          ],
          align: 'left',
        tandem: tandem.createTandem( 'spacingUnit' )
        }
      );
      vectorVBox = new VBox( {
        children: [
          velocityArrow,
          new VStrut( 8 ),
          accelerationArrow,
          new VStrut( 35 ),
          gravityArrow,
          new VStrut( 10 ),
          springArrow,
          new VStrut( 15 ),
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
          vectorVisibilityCheckboxGroup,
          new VStrut( 2 )
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

    Panel.call( this, controlsHBox, options );
  }

  massesAndSprings.register( 'VectorVisibilityControlPanel', VectorVisibilityControlPanel );

  return inherit( Panel, VectorVisibilityControlPanel );
} );
