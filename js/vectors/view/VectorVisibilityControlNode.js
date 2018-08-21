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
  var ForcesModeChoice = require( 'MASSES_AND_SPRINGS/common/enum/ForcesModeChoice' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
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

  // constants
  var MAX_WIDTH = 205;

  /**
   * @param {VectorModel} model
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function VectorVisibilityControlNode( model, tandem, options ) {
    options = _.extend( {
      showForces: true,
      fill: MassesAndSpringsConstants.PANEL_FILL,
      tandem: tandem.createTandem( 'vectorVisibilityControlNode' )
    }, options );

    Node.call( this, options );

    var velocityArrow = new VectorArrow( MassesAndSpringsConstants.VELOCITY_ARROW_COLOR );
    var accelerationArrow = new VectorArrow( MassesAndSpringsConstants.ACCELERATION_ARROW_COLOR );
    var gravityArrow = new ForceVectorArrow( MassesAndSpringsConstants.GRAVITY_ARROW_COLOR );
    var springArrow = new ForceVectorArrow( MassesAndSpringsConstants.SPRING_ARROW_COLOR );
    var netForceArrow = new ForceVectorArrow( 'black' );

    // responsible for velocity and acceleration vectors checkboxes
    var vectorVisibilityCheckboxGroup = new VerticalCheckboxGroup( [ {
      node: new Text( velocityString, {
        font: MassesAndSpringsConstants.TITLE_FONT,
        maxWidth: MAX_WIDTH,
        tandem: tandem.createTandem( 'velocityString' )
      } ),
      property: model.velocityVectorVisibilityProperty,
      label: velocityString
    }, {
      node: new Text( accelerationString, {
        font: MassesAndSpringsConstants.TITLE_FONT,
        maxWidth: MAX_WIDTH,
        tandem: tandem.createTandem( 'accelerationString' )
      } ),
      property: model.accelerationVectorVisibilityProperty,
      label: accelerationString
    }
    ], {
      checkboxOptions: { boxWidth: 16 },
      tandem: tandem.createTandem( 'vectorVisibilityCheckboxGroup' )
    } );

    // responsible for forces vectors checkboxes
    var forcesVisibilityCheckboxGroup = new VerticalCheckboxGroup( [ {
      node: new Text( gravityString, {
        font: MassesAndSpringsConstants.TITLE_FONT,
        maxWidth: MAX_WIDTH,
        tandem: tandem.createTandem( 'gravityString' )
      } ),
      property: model.gravityVectorVisibilityProperty,
      label: gravityString
    }, {
      node: new Text( springString, {
        font: MassesAndSpringsConstants.TITLE_FONT,
        maxWidth: MAX_WIDTH,
        tandem: tandem.createTandem( 'springString' )
      } ),
      property: model.springVectorVisibilityProperty,
      label: springString
    } ], {
      checkboxOptions: { boxWidth: 16 },
      xMargin: 20,
      tandem: tandem.createTandem( 'forcesVisibilityCheckboxGroup' )
    } );

    // responsible for forces aquaRadioButton
    var forcesVisibilityRadioButton = new AquaRadioButton(
      model.forcesModeProperty,
      ForcesModeChoice.FORCES,
      new Text( forcesString, {
        font: MassesAndSpringsConstants.TITLE_FONT,
        maxWidth: MAX_WIDTH,
        tandem: tandem.createTandem( 'forcesString' )
      } ),
      { radius: 7, spacing: 7 }
    );

    // responsible for net force aquaRadioButton
    var netForceVisibilityRadioButton = new AquaRadioButton(
      model.forcesModeProperty,
      ForcesModeChoice.NET_FORCES,
      new HBox( {
        children: [ new Text( netForceString, {
          font: MassesAndSpringsConstants.TITLE_FONT,
          maxWidth: MAX_WIDTH,
          tandem: tandem.createTandem( 'netForceString' )
        } ) ]
      } ),
      { radius: 7, spacing: 7 }
    );

    // manages the mutability of the forces checkboxes dependent on the forces and net force aquaRadioButton
    model.forcesModeProperty.link( function( mode ) {
      if ( mode === ForcesModeChoice.FORCES ) {
        forcesVisibilityCheckboxGroup.pickable = true;
        forcesVisibilityCheckboxGroup.opacity = 1;
      }
      else if ( mode === ForcesModeChoice.NET_FORCES ) {
        forcesVisibilityCheckboxGroup.pickable = false;
        forcesVisibilityCheckboxGroup.opacity = 0.3;
      }
    } );

    // Contains all checkboxes and radio buttons for vector visibility
    var vectorVisibilityControlsVBox;

    // Contains all vectors for each force
    var vectorVBox;

    // groups the checkboxes and forces aquaRadioButton
    if ( options.showForces ) {
      vectorVisibilityControlsVBox = new VBox( {
          children: [
            vectorVisibilityCheckboxGroup,
            forcesVisibilityRadioButton,
            new AlignBox( forcesVisibilityCheckboxGroup, { leftMargin: 22 } ),
            netForceVisibilityRadioButton
          ],
          spacing: 8,
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
        yMargin: 0,
        align: 'left',
        tandem: tandem.createTandem( 'spacingUnit' )
      } );
    }
    else {
      vectorVisibilityControlsVBox = new VBox( {
        children: [
          vectorVisibilityCheckboxGroup
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
      spacing: 55,
      children: [
        vectorVisibilityControlsVBox,
        vectorVBox
      ]
    } );
    this.addChild( controlsHBox );
  }

  massesAndSprings.register( 'VectorVisibilityControlNode', VectorVisibilityControlNode );

  return inherit( Node, VectorVisibilityControlNode );
} );